import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {Leaderboard} from "../model/leaderboard";
import {ActivityServiceService} from "../service/activity-service.service";
import {UserServiceService} from "../service/user-service.service";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  users: User[] = [];
  leaderboards: Leaderboard[] = [];
  filteredLeaderboards: Leaderboard[] = [];

  ascending: boolean = false;
  currentSortAttribute: string = ''; // Aktuelle Sortierspalte
  error: string | null = null;
  usercount: number = 0; // = leaderboard-length
  totalLikes: number | null =null;

  constructor(private activityService: ActivityServiceService, private userService: UserServiceService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username'); // Username des eingeloggten Benutzers
    if (username) {
      this.loadLeaderboard();
    } else {
      this.error = 'Kein Benutzer eingeloggt.';
    }
  }

  loadLeaderboard() {
    this.userService.findAll().subscribe({
      next: (data) => {
        this.users = data;
        this.usercount = data.length;

        let completedUsers = 0; // Zähler für abgeschlossene Benutzer

        for (let i = 0; i < this.usercount; i++) {
          const curruser = this.users[i].username;

          if (curruser) {
            const leaderboardEntry: Leaderboard = {
              username: curruser,
              activityCount: 0,
              totalDuration: 0,
              totalDistance: 0,
              totalCalories: 0,
              totalElevationGain: 0,
              avgSpeed: 0,
              maxSpeed: 0,
              totalLikes:0
            };

            // Asynchrone API-Aufrufe
            this.activityService.getCountActivityByUserName(curruser).subscribe({
              next: (data) => (leaderboardEntry.activityCount = data),
              complete: () => this.checkCompletion(++completedUsers, this.usercount),
            });

            this.activityService.getTotalDurationByUsername(curruser).subscribe({
              next: (data) => (leaderboardEntry.totalDuration = data),
              complete: () => this.checkCompletion(++completedUsers, this.usercount),
            });

            this.activityService.getTotalDistanceByUsername(curruser).subscribe({
              next: (data) => (leaderboardEntry.totalDistance = data),
              complete: () => this.checkCompletion(++completedUsers, this.usercount),
            });

            this.activityService.getTotalCaloriesByUsername(curruser).subscribe({
              next: (data) => (leaderboardEntry.totalCalories = data),
              complete: () => this.checkCompletion(++completedUsers, this.usercount),
            });

            this.activityService.getTotalElevationGainByUsername(curruser).subscribe({
              next: (data) => (leaderboardEntry.totalElevationGain = data),
              complete: () => this.checkCompletion(++completedUsers, this.usercount),
            });

            this.activityService.getAverageSpeedByUsername(curruser).subscribe({
              next: (data) => (leaderboardEntry.avgSpeed = data),
              complete: () => this.checkCompletion(++completedUsers, this.usercount),
            });

            this.activityService.getMaxAverageSpeedByUsername(curruser).subscribe({
              next: (data) => (leaderboardEntry.maxSpeed = data),
              complete: () => this.checkCompletion(++completedUsers, this.usercount),
            });


              this.activityService.countLikesForUser(curruser).subscribe(
                (totalLikes: number) => {
                  leaderboardEntry.totalLikes = totalLikes;
                },
                (error) => {
                  console.error(`Fehler beim Laden der Gesamtanzahl der Likes für Benutzer:` + curruser, error);
                }
              );


            this.leaderboards[i] = leaderboardEntry; // Speichere den Eintrag
          }
        }
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzer:', err);
      },
    });
  }

  checkCompletion(completedUsers: number, totalUsers: number): void {
    // Überprüfe, ob alle API-Aufrufe abgeschlossen sind
    if (completedUsers === totalUsers * 7) { // 7 API-Aufrufe pro Benutzer
      // Sortiere nach 'activityCount'
      this.sortLeaderboard('activityCount', false);
      console.log('Alle Daten wurden geladen und die Tabelle wurde sortiert.');
    }
  }

  sortLeaderboard(attribute: string, ascending: boolean): void {
    this.filteredLeaderboards = this.leaderboards.sort((a, b) => {
      const valueA = (a as any)[attribute];
      const valueB = (b as any)[attribute];

      if (valueA < valueB) {
        return ascending ? -1 : 1;
      } else if ( valueA> valueB) {
        return ascending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  toggleSort(attribute: string): void {
    if (this.currentSortAttribute === attribute) {
      // Wenn bereits nach diesem Attribut sortiert wird, Richtung umkehren
      this.ascending = !this.ascending;
    } else {
      // Nach neuem Attribut sortieren, Standardrichtung ist absteigend
      this.ascending = false;
      this.currentSortAttribute = attribute;
    }
    this.sortLeaderboard(attribute, this.ascending);
  }



}

