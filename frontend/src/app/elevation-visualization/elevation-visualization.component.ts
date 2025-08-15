import { Component, OnInit } from '@angular/core';
import { ActivityServiceService } from '../service/activity-service.service';
import { ActivatedRoute } from '@angular/router';
import { Activity } from '../model/activity';
import Chart, { ChartDataset, TooltipItem } from 'chart.js/auto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-elevation-visualization',
  templateUrl: './elevation-visualization.component.html',
  styleUrls: ['./elevation-visualization.component.css']
})
export class ElevationVisualizationComponent implements OnInit {
  activityId!: number; // ID der Aktivität
  activity!: Activity; // Die Aktivität selbst
  elevations: number[] = []; // Höhenwerte
  timestamps: string[] = []; // Zeitstempel
  likeCount: number | null =null;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityServiceService
  ) {}

  ngOnInit(): void {
    this.activityId = +this.route.snapshot.paramMap.get('id')!;
    this.loadElevationData();
    this.loadLikesCount();
  }

  // Lädt die Höhenvisualisierungsdaten der Aktivität
  loadElevationData(): void {
    this.activityService.getElevationData(this.activityId).subscribe({
      next: (response: any) => {
        this.activity = response.activity; // Speichert die Aktivität
        this.elevations = response.gpxData.map((point: any) =>
          parseFloat(point.elevation.toFixed(2)) // Höhenwerte runden
        );
        // Zeitstempel umformatieren in ein lesbares Format
        this.timestamps = response.gpxData.map((point: any) => {
          const date = new Date(point.timestamp);
          // Format: 'DD.MM.YYYY HH:mm'
          return date.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        });

        if (this.elevations.length > 0 && this.timestamps.length > 0) {
          this.renderElevationChart(); // Rendert das Diagramm
        } else {
          console.error('Keine gültigen Daten für das Diagramm gefunden.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Fehler beim Laden der Höhenvisualisierungsdaten:', err.message);
      }
    });
  }

  // Rendert das Höhen-Diagramm
  renderElevationChart(): void {
    const ctx = document.getElementById('elevationChart') as HTMLCanvasElement;//Diagramm-Kontext holen
    if (!ctx) {
      console.error('Canvas-Element "elevationChart" wurde nicht gefunden.');
      return;
    }

    new Chart(ctx, {
      type: 'line', // Liniendiagramm
      data: {
        labels: this.timestamps, // X-Achse: Zeitstempel
        datasets: [
          {
            label: 'Höhenänderung',
            data: this.elevations, // Y-Achse: Höhenwerte
            borderColor: 'blue', // Linienfarbe
            borderWidth: 0.5, // Dünnere Linie
            tension: 0.3, // Glättung der Linie
            fill: false, // Keine Fläche unter der Linie
            pointRadius: 3, // Punktgröße für bessere Sichtbarkeit
            pointHoverRadius: 5, // Punktgröße beim Hover
            backgroundColor: 'rgba(0, 0, 255, 0.3)', // Punktfarbe
          } as ChartDataset<'line'> // Typisierung des Datasets
        ]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems: TooltipItem<'line'>[]) => {
                const timestamp = tooltipItems[0].label;
                return `Zeit: ${timestamp}`;
              },
              label: (tooltipItem: TooltipItem<'line'>) => {
                const elevation = tooltipItem.raw; // Höhenwert
                return `Höhe: ${(elevation as number).toFixed(2)} m`; // Höhenwert runden
              },
              afterBody: () => {
                // Zeigt statische Informationen an
                return [
                  '',
                  '--- Aktivitätsdetails ---',
                  `Name: ${this.activity.activityName || 'Nicht verfügbar'}`,
                  `Typ: ${this.activity.activityType || 'Nicht verfügbar'}`,
                  `Dauer: ${(this.activity.totalDuration || 0).toFixed(2)} Minuten`,
                  `Distanz: ${((this.activity.totalDistance || 0) / 1000).toFixed(2)} km`, // Distanz runden
                  `Durchschnittsgeschwindigkeit: ${(this.activity.averageSpeed || 0).toFixed(2)} km/h`, // Geschwindigkeit runden
                  `Erklommene Höhe: ${(this.activity.totalElevationGain || 0).toFixed(2)} m`, // Höhe runden
                  `Verbrannte Kalorien: ${(this.activity.totalCalories || 0).toFixed(2)} kcal`, // Kalorien runden
                  `Anzahl der Likes: ${this.likeCount}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Zeit (Timestamps)' // Titel für die X-Achse
            }
          },
          y: {
            title: {
              display: true,
              text: 'Höhe (m)' // Titel für die Y-Achse
            }
          }
        }
      }
    });
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
