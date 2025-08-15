import { Component, OnInit } from '@angular/core';
import {ActivityServiceService} from "../../service/activity-service.service";


@Component({
  selector: 'app-activity-achievement',
  templateUrl: './activity-achievement.component.html',
  styleUrl: './activity-achievement.component.css'
})
export class ActivityAchievementComponent implements OnInit {

  // Fehlermeldung-handler
  error: string | null = null;

  //Levels-handler
  firstLevelWalking: boolean = false; secondLevelWalking: boolean = false; thirdLevelWalking: boolean = false;
  firstLevelRunning: boolean = false; secondLevelRunning: boolean = false; thirdLevelRunning: boolean = false;
  firstLevelHiking: boolean = false; secondLevelHiking: boolean = false; thirdLevelHiking: boolean = false;
  firstLevelCycling: boolean = false; secondLevelCycling: boolean = false; thirdLevelCycling: boolean = false;

  //insgesamt-Levels-handler
  totalWalking = 0;
  totalRunning = 0;
  totalHiking = 0;
  totalCycling = 0;

  constructor(private activityService: ActivityServiceService) {}

  ngOnInit(): void {
    console.log("Hii")
    const username = localStorage.getItem('username'); // Username des eingeloggten Benutzers
    if (username) {
      this.loadAchievements(username);
    } else {
      this.error = 'Kein Benutzer eingeloggt.';
    }

  }

  loadAchievements(username: string): void {
    // 1. Lade alle Aktivitäten des Benutzers
    this.activityService.getActivityByUserName(username).subscribe({
      next: (activities: any[]) => {

        // Überprüfe jede Aktivität
        for (let activity of activities) {
          const distanceInKm = Number((activity.totalDistance/1000).toFixed(2)); // Distanz der Aktivität
          const activityType = activity.activityType;

          console.log("Sara braucht das activity distance " + distanceInKm);
          console.log("Sara braucht das activity Name " + activityType);

          // Spazieren-Erfolge
          if(activityType === 'WALKING') {
            this.totalWalking += distanceInKm;
            if (distanceInKm >= 2) this.firstLevelWalking = true;
            if (distanceInKm >= 5) this.secondLevelWalking = true;
          }

          // Laufen-Erfolge
          if(activityType === 'RUNNING') {
            this.totalRunning += distanceInKm;
            if (distanceInKm >= 5) this.firstLevelRunning = true;
            if (distanceInKm >= 10) this.secondLevelRunning = true;
          }

          // Wandern-Erfolge
          if(activityType === 'HIKING'){
            this.totalHiking += distanceInKm;
            if (distanceInKm >= 10) this.firstLevelHiking = true;
            if (distanceInKm >= 20) this.secondLevelHiking = true;
          }

          // Radfahren-Erfolge
          if(activityType === 'CYCLING'){
            this.totalCycling += distanceInKm;
            if (distanceInKm >= 50) this.firstLevelCycling = true;
            if (distanceInKm >= 100) this.secondLevelCycling = true;
          }
        }

        // Gesamtdistanzerfolge
        console.log("Sara braucht totalRahdfahren "+ this.totalRunning);
        if (this.totalWalking >= 100) this.thirdLevelWalking = true;
        if (this.totalRunning >= 50) this.thirdLevelRunning = true;
        if (this.totalHiking >= 100) this.thirdLevelHiking = true;
        if (this.totalCycling >= 500) this.thirdLevelCycling = true;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Aktivitäten.';
        console.error(err);
      }
    });
  }
}
