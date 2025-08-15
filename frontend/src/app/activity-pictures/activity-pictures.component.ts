import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../service/user-service.service';
import {ActivityServiceService} from "../service/activity-service.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-activity-pictures',
  templateUrl: './activity-pictures.component.html',
  styleUrls: ['./activity-pictures.component.css'],
})
export class ActivityPicturesComponent implements OnInit {
  activities: any[] = []; // Aktivitätenliste
  gpsCoordinates: any[] = []; // Liste der GPS-Koordinaten
  selectedActivity: string = ''; // Ausgewählte Aktivität
  selectedCoordinate: string = ''; // Ausgewählte Koordinate
  selectedFile: File | null = null; // Hochgeladenes Bild
  caption: string = ''; // Bildunterschrift
  previewUrl: string | null = null; // Bildvorschau-URL
  base64Image: string | null = null; // Base64-Darstellung des Bildes
  errorMessage: string | null = null; // Fehlermeldungen
  selectedActivityId: string | null = null; // Die ID der ausgewählten Aktivität

  constructor(private service: UserServiceService,
              private activityService: ActivityServiceService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadActivityFromLocalStorage();
    if (this.selectedActivityId) {
      this.loadCoordinates(this.selectedActivityId);
    }

  }

  // Lädt die gespeicherte Aktivität aus dem LocalStorage
  loadActivityFromLocalStorage(): void {
    const activityId = localStorage.getItem('selectedActivityId');
    if (activityId) {
      this.selectedActivityId = activityId;
      console.log(`Geladene Activity ID aus LocalStorage: ${this.selectedActivityId}`);
    } else {
      this.errorMessage = 'Keine Aktivität ausgewählt. Bitte kehren Sie zur Aktivitätenliste zurück.';
      console.error('Keine Aktivität ausgewählt.');
    }
  }


  // Ruft GPS-Koordinaten für die ausgewählte Aktivität ab
  loadCoordinates(activityId: string): void {
    this.activityService.getGPXCoordinates(activityId).subscribe({
      next: (coordinates: any[]) => {
        this.gpsCoordinates = coordinates;
        this.errorMessage = coordinates.length
          ? null
          : 'Keine GPS-Koordinaten für diese Aktivität gefunden.';
      },
      error: () => {
        this.errorMessage = 'Fehler beim Laden der GPS-Koordinaten.';
      },
    });
  }


  // Wird ausgelöst, wenn ein Benutzer ein Bild auswählt
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Vorschau des Bildes erstellen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Hochladen des Bildes und zugehöriger Daten
  uploadPicture(): void {
    if (!this.validateForm()) {
      return;
    }

    if (!this.selectedFile || !this.caption.trim() || !this.selectedCoordinate) {
      this.errorMessage = 'Bitte alle Felder ausfüllen.';
      return;
    }

    const formData = new FormData();

    // Activity Picture Daten als JSON-Objekt anhängen
    const activityPictureData = {
      caption: this.caption,
      gpxDataId: this.selectedCoordinate, // GPX-Daten-ID
    };

    formData.append(
      'activityPictureData',
      new Blob([JSON.stringify(activityPictureData)], { type: 'application/json' }) //Daten zu Json konvertieren
    );
   // Bild als MultipartFile anhängen
   formData.append('file', this.selectedFile);

   // Sende die Daten an den Backend-Service
   this.service.uploadPicture(formData).subscribe({
     next: (response) => {
       console.log('Bild erfolgreich hochgeladen:', response);
       console.log('GPS Foto Hochladen erfolgreich!');
       this.resetForm();
       this.router.navigate(['/activitylist']);

     },
     error: (errorResponse) => {
       console.error('Fehler beim Hochladen des Bildes:', errorResponse);
       this.errorMessage =
         'Ein Fehler ist beim Hochladen aufgetreten. Eventuell existiert für diese Koordinate schon ein Bild.';
     },
   });
  }

  // Überprüft, ob alle notwendigen Felder ausgefüllt sind
  validateForm(): boolean {
    if (!this.selectedCoordinate) {
      this.errorMessage = 'Bitte wählen Sie eine gültige GPS-Koordinate aus.';
      return false;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Bitte wählen Sie ein Bild aus.';
      return false;
    }

    if (!this.caption.trim()) {
      this.errorMessage = 'Bitte geben Sie eine Bildunterschrift ein.';
      return false;
    }

    this.errorMessage = null; // Keine Fehler
    return true;
  }


  // Formular zurücksetzen
  resetForm(): void {
    this.selectedFile = null;
    this.caption = '';
    this.previewUrl = null;
    this.selectedActivity = '';
    this.selectedCoordinate = '';

  }
}
