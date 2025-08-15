
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ActivityServiceService } from '../../service/activity-service.service';
import {Activity} from "../../model/activity";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-activity-map',
  templateUrl: './activity-map.component.html',
  styleUrls: ['./activity-map.component.css']
})
export class ActivityMapComponent implements OnInit {
  activityId!: number; // ID der Aktivität
  activity!: Activity; // Die Aktivität selbst
  private map: L.Map | undefined;
  private markers: Map<number, L.Marker> = new Map<number, L.Marker>();
  likeCount: number | null =null;


  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityServiceService) {}


  ngOnInit(): void {
    this.activityId = +this.route.snapshot.paramMap.get('id')!;// Holt die Aktivitäts-ID aus der URL und speichert sie
    this.initMap(); // Initialisiert die Leaflet-Karte
    this.loadRoute();// Lädt die Aktivitäts-Route und zeigt sie auf der Karte an
    this.loadLikesCount();
  }
  // Initialisiert die Karte
  private initMap(): void {
    this.map = L.map('map', {
      center: [48.8584, 2.2945], // Standard-Koordinaten
      zoom: 13, // Standard-Zoom
      scrollWheelZoom: true, // Aktiviert das Zoomen per Scrollrad
      zoomControl: true // Aktiviert die Zoom-Steuerung
    });

    // Kartenkacheln hinzuzufügen
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadRoute(): void {
    this.activityService.getRoute(this.activityId).subscribe({
      next: (data) => {
        console.log('Empfangene Routen-Daten:', data);

        // Konvertiere die Route-Daten in LatLng-Arrays für Leaflet
        const latlngs = data.route.map((point: { latitude: number; longitude: number }) => {
          return [point.latitude, point.longitude] as L.LatLngTuple;
        });

        // Prüfe, ob LatLngs korrekt sind
        if (latlngs.length === 0) {
          console.error('Keine gültigen Koordinaten für die Route gefunden.');
          return;
        }

        // Erstelle die Polyline (Pfad)
        const polyline = L.polyline(latlngs, {color: 'blue', weight: 5}).addTo(this.map!);

        // Tooltip hinzufügen: Aktivitätsdetails anzeigen
        polyline.bindTooltip(`
        <strong>Aktivitätsdetails:</strong><br>
        Name: ${data.activity.activityName}<br>
        Typ: ${data.activity.activityType}<br>
        Dauer: ${data.activity.totalDuration} Minuten<br>
        Distanz: ${(data.activity.totalDistance / 1000).toFixed(2)} km<br>
        Geschwindigkeit: ${data.activity.averageSpeed.toFixed(2)} km/h<br>
        Höhengewinn: ${data.activity.totalElevationGain.toFixed(2)} m<br>
        Kalorien: ${data.activity.totalCalories.toFixed(2)} kcal<br>
        Anzahl der Likes: ${this.likeCount}
      `, {
          sticky: true // Tooltip bleibt am Mauszeiger "kleben"
        });

        // Füge eine Mouseover-Hervorhebung hinzu
        polyline.on('mouseover', () => {
          polyline.setStyle({color: 'orange', weight: 7}); // Ändere die Farbe und Dicke beim Hover
        });

        // Setze den Stil bei Mouseout zurück
        polyline.on('mouseout', () => {
          polyline.setStyle({color: 'blue', weight: 5}); // Zurück zum Standardstil
        });

        // Passe die Karte an die Polyline an
        this.map!.fitBounds(polyline.getBounds());

        // **Neue Methode für Bilder aufrufen**
        this.addPicturesToRoute(data.route);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Route:', err);
      }
    });
  }

  private addPicturesToRoute(route: Array<{ id: number; latitude: number; longitude: number }>): void {
    route.forEach((point) => {
      this.activityService.getPictureByGpxDataId(point.id).subscribe({
        next: (data: { photoBase64: string; caption: string; id: number }) => {
          // Erstelle ein Icon mit dem Bild
          const icon = L.icon({
            iconUrl: `data:image/jpeg;base64,${data.photoBase64}`,
            iconSize: [50, 50],
            iconAnchor: [25, 50],
          });

          // Marker hinzufügen
          const marker = L.marker([point.latitude, point.longitude], { icon }).addTo(this.map!);

          // Speichere den Marker mit seiner `pictureId`
          this.markers.set(data.id, marker);

          // Dynamisches HTML für das Popup
          const popupContent = document.createElement('div');
          popupContent.innerHTML = `
          <div style="text-align: center;">
            <img src="data:image/jpeg;base64,${data.photoBase64}" style="width: 100px; height: auto;" />
            <p><strong>${data.caption}</strong></p>
            <button style="color: white; border-radius: 10px; background: red; font-size: 16px; cursor: pointer;">
              Bild löschen
            </button>
          </div>
        `;

          // Füge Event-Listener für den Button hinzu
          const deleteButton = popupContent.querySelector('button');
          deleteButton?.addEventListener('click', () => {
            this.deletePicture(data.id);
          });

          // Binde das Popup an den Marker
          marker.bindPopup(popupContent);
        },
        error: (err) => {
          console.error(`Fehler beim Laden des Bildes für GPS-Punkt ${point.id}:`, err);
        }
      });
    });
  }

  deletePicture(pictureId: number): void {
    if (confirm('Möchten Sie dieses Bild wirklich löschen?')) {
      this.activityService.deletePicture(pictureId).subscribe({
        next: () => {
          alert('Das Bild wurde erfolgreich gelöscht.');

          // Finde den Marker in der Map
          const marker = this.markers.get(pictureId);
          if (marker) {
            this.map!.removeLayer(marker); // Entferne den Marker von der Karte
            this.markers.delete(pictureId); // Entferne den Marker aus der Map
          }
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Bildes:', err);
        }
      });
    }
    else return;
  }

  loadLikesCount(): void {
    this.activityService.countLikesForActivity(this.activityId).subscribe(
      (likeCount) => {
        this.likeCount = likeCount;
      },
      (error) => {
        console.error(`Fehler beim Laden der Like-Anzahl für Aktivität:` + this.activityId, error);
      }
    );
  }
}

