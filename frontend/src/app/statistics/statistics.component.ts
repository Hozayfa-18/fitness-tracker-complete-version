
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatisticsService } from '../service/statistics.service';
import { Activity } from '../model/activity';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  activityId!: number; // ID der Aktivität, die von der Route extrahiert wird
  activity?: Activity; // Speichert die geladene Aktivität
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    // Extrahieren Sie die Aktivitäts-ID aus der Route..
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.activityId = +idParam; // Konvertieren in eine Zahl
        console.log('Geladene Activity ID:', this.activityId);
        this.loadActivityStatistics();
      } else {
        this.errorMessage = 'Keine gültige Aktivitäts-ID vorhanden.';
      }
    });
  }

  loadActivityStatistics(): void {
    // Abrufen der Aktivität mit den Statistiken.
    this.statisticsService.getStatisticsByActivityId(this.activityId).subscribe(
      data => {
        console.log('Aktivitätsdaten:', data);
        this.activity = data;
      },
      error => {
        this.errorMessage = 'Fehler beim Laden der Aktivität: ' + error.message;
      }
    );
  }
}
