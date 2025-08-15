import { Component, OnInit } from '@angular/core';
import {Activity, Visibility} from "../../model/activity";
import {ActivityServiceService} from "../../service/activity-service.service"
import { Router } from '@angular/router';
import {ElevationVisualizationComponent} from "../../elevation-visualization/elevation-visualization.component";
import {UserServiceService} from "../../service/user-service.service";

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = []; // Hier werden die Aktivitäten gespeichert
  filteredActivities: Activity[] = []; //neue Liste zeigen nach eine Suche- odere Sortierfunktion
  sortAscending: boolean = true; // Sortierrichtung
  currentSortAttribute: string = ''; // Aktuelle Sortierspalte
  error: string | null = null;
  likeCount: number | null = null;
  sichtbarkeit: boolean = false;

  selectedActivityId: number | null = null; // Speichert die ID der Aktivität für Kommentare
  newComment: string = ''; // Der neue Kommentar
  comments: any[] = [];
  username: string = '';
  content: string = '';
  timestamp: any;



  constructor(
    private activityService: ActivityServiceService,
    private router: Router,
    private userService: UserServiceService
  ) {}


//   // deleteActivity(){
//   //   this.activityService.delete().subscribe({
//   //     next: () => {
//   //       // Entferne die Aktivität aus der Liste, nachdem sie gelöscht wurde
//   //       this.activities = this.activities.filter(activity => activity.id !== activityId);
//   //     },
//   //     error: (err) => {
//   //       console.error('Fehler beim Löschen der Aktivität:', err);
//   //     }
//   //   });
//   // }

// submitSearch(input:String): void {
//   this.activityService.getActivityByName(input)
//     .subscribe((data: Activity[]) => {
//       this.activities = data;})
// }

  ngOnInit(): void {
    const username = localStorage.getItem('username'); // Username des eingeloggten Benutzers
    if (username) {
      this.loadActivities(username);
    } else {
      this.error = 'Kein Benutzer eingeloggt.';
    }
    // this.loadActivities();
  }

  // Mit Usename Lädt alle Aktivitäten eines bestimmten Benutzers
  loadActivities(username: string): void {
    this.activityService.getActivityByUserName(username)
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.filteredActivities = data;
          this.loadLikesCount();
        },
        error: (err) => {
          this.error = 'Fehler beim Laden der Aktivitäten. Bitte versuchen Sie es später erneut.';
          console.error(err);
        }
      });
  }

  //Ohne Username
  // loadActivities(): void {
  //   this.activityService.getAllActivities()
  //     .subscribe({
  //       next: (data) => {
  //         this.activities = data;
  //         this.filteredActivities = data;
  //       },
  //       error: (err) => {
  //         this.error = 'Fehler beim Laden der Aktivitäten. Bitte versuchen Sie es später erneut.';
  //         console.error(err);
  //       }
  //     });
  // }


  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase().trim();

    if (searchValue) {
      // Filtere Aktivitäten nach exakter Übereinstimmung des Namens
      this.filteredActivities = this.activities.filter(
        (activity) => activity.activityName && activity.activityName.toLowerCase() === searchValue);

      // Wenn keine Übereinstimmungen gefunden werden
      if (this.filteredActivities.length === 0) {
        this.error = `Keine Aktivität mit dem Namen "${searchValue}" gefunden.`;
      } else {
        // Setze die Fehlermeldung zurück, wenn eine Übereinstimmung gefunden wurde
        this.error = null;
      }
    } else {
      // Falls keine Suchanfrage eingegeben wurde, setze die Liste zurück und lösche eventuelle Fehlermeldungen
      this.filteredActivities = this.activities;
      this.error = null;
    }
  }


  toggleSort(attribute: string): void {
    // Wenn dieselbe Spalte erneut geklickt wird, dann Sortierreihenfolge umkehren
    if (this.currentSortAttribute === attribute) {
      this.sortAscending = !this.sortAscending;
    } else {
      // Neue Spalte: Standardmäßig aufsteigend sortieren
      this.currentSortAttribute = attribute;
      this.sortAscending = true;
    }

    // Sortieren der Aktivitätenliste
    this.filteredActivities.sort((a, b) => {
      const valueA = (a as any)[attribute];
      const valueB = (b as any)[attribute];

      if (valueA < valueB) {
        return this.sortAscending ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  openElevationVisualization(activityId: number): void {
    // Navigiere zur Höhenvisualisierung mit der Aktivitäts-ID
    this.router.navigate(['/elevation-visualization', activityId]);

  }

  openActivityMap(activityId: number): void {
    this.router.navigate(['/map', activityId]);
  }

  openActivityPicture(activityId: number): void {
    localStorage.setItem('selectedActivityId', activityId.toString());
    this.router.navigate(['/activitypictures'])
  }

  loadLikesCount(): void {
    this.activities.forEach((activity) => {
        this.activityService.countLikesForActivity(activity.id!).subscribe(
          (likeCount) => {
            activity.likeCount = likeCount;
          },
          (error) => {
            console.error(`Fehler beim Laden der Like-Anzahl für Aktivität ${activity.id}:`, error);
          }
        );
      }
    );
  }


  // Öffnet den Kommentarbereich für eine Aktivität
  toggleCommentSection(activityId: number): void {
    if (this.selectedActivityId === activityId) {
      // Kommentarbereich schließen
      this.selectedActivityId = null;
      this.comments = []; // Kommentare zurücksetzen
      this.error = null;
    } else {
      // Kommentarbereich öffnen und Kommentare laden
      this.selectedActivityId = activityId;
      this.loadComments(activityId); // Kommentare der ausgewählten Aktivität laden
      this.error = null;
    }
  }

  addComment(): void {
    const loggedinUsername = localStorage.getItem('username');

    // Validierung der Eingaben
    if (!this.isCommentInputValid(loggedinUsername)) {
      return;
    }

    const selectedActivity = this.getSelectedActivity();
    // Überprüfung, ob die Aktivität kommentierbar ist
    if (!selectedActivity) {
      return; // Wenn keine Aktivität gefunden wurde, Abbruch
    }

    // Kommentar-Payload erstellen und senden
    const commentPayload = this.createCommentPayload(loggedinUsername!);
    this.submitComment(commentPayload);
  }

// 1. Überprüft, ob die Eingaben gültig sind
  private isCommentInputValid(username: string | null): boolean {
    if (!this.newComment.trim() || !this.selectedActivityId) {
      this.error = 'Bitte geben Sie einen Kommentar ein.';
      console.error('Fehler: Kommentar oder Aktivität nicht vorhanden.');
      return false;
    }

    if (!username) {
      this.error = 'Benutzer nicht eingeloggt.';
      console.error('Fehler: Benutzer nicht eingeloggt.');
      return false;
    }

    return true;
  }

// 2. Holt die ausgewählte Aktivität aus der Liste
  private getSelectedActivity(): Activity | undefined {
    const activity = this.activities.find(act => act.id === this.selectedActivityId);

    if (!activity) {
      this.error = 'Aktivität nicht gefunden.';
      console.error('Fehler: Aktivität nicht gefunden.');
    }

    return activity;
  }

// 3. Erstellt das Payload für den Kommentar
  private createCommentPayload(username: string): any {
    return {
      username: username,
      activityId: this.selectedActivityId,
      content: this.newComment.trim() };
  }

// 4. Sendet den Kommentar und verarbeitet die Antwort
  private submitComment(commentPayload: any): void {
    this.activityService.addComment(commentPayload).subscribe(
      (response: any) => {
        console.log('Kommentar erfolgreich hinzugefügt:', response);

        // Kommentar zur lokalen Liste hinzufügen
        this.comments.unshift({
          id: response.id, // Falls das Backend die ID zurückgibt
          username: response.user.username,
          content: response.content,
        });

        // Eingabefeld leeren
        this.newComment = '';
      },
      (error) => {
        console.error('Fehler beim Hinzufügen des Kommentars:', error);

        // Fehler basierend auf der Sichtbarkeit behandeln
        const selectedActivity = this.activities.find(
          (activity) => activity.id === this.selectedActivityId
        );

        if (selectedActivity) {
          if (selectedActivity.visibility === 'PRIVATE') {
            this.error = 'Diese Aktivität ist privat und kann nicht kommentiert werden.';
          } else if (selectedActivity.visibility === 'FRIENDS') {
            this.error = 'Diese Aktivität kann nur von Freunden kommentiert werden.';
          } else {
            this.error = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
          }
        } else {
          this.error = 'Die ausgewählte Aktivität existiert nicht.';
        }
      }
    );
  }


  loadComments(activityId: number): void {
    const selectedActivity = this.activities.find((activity) => activity.id === activityId);

    // Sichtbarkeit prüfen
    if (!selectedActivity  && !selectedActivity!.isPublic) {
      console.error('Kommentare für private Aktivitäten können nicht geladen werden.');
      this.error = 'Aktivität nicht gefunden';
      return;
    }

    this.activityService.getCommentsForActivity(activityId).subscribe(
      (comments: any[]) => {
        // Speichert alle Kommentare der Aktivität im lokalen Array
        this.comments = comments.map(comment => ({
          id: comment.id,
          username: comment.user.username,
          content: comment.content,
        }))
          .reverse();
      },
      (error) => {
        console.error(`Fehler beim Laden der Kommentare für Aktivität ${activityId}:`, error);
      }
    );
  }

   deleteComment(commentId: number, activityId: number): void {
    const username = localStorage.getItem('username');

    // Validierung der Eingaben
    if (!this.isDeleteInputValid(username, commentId, activityId)) {
      return;
    }

    // Benutzerinformationen abrufen und Löschvorgang starten
    this.userService.findByUsername(username!).subscribe(
      (user) => {
        const isAdmin = user.role === 'admin';
        const comment = this.getCommentById(commentId);

        if (!this.canDeleteComment(comment, username!, isAdmin)) {
          return;
        }

        this.performCommentDeletion(commentId, isAdmin);
      },
      (error) => {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      }
    );
  }

// 1. Validiert die Eingaben
  private isDeleteInputValid(username: string | null, commentId: number, activityId: number): boolean {
    if (!username || !commentId || !activityId) {
      this.error = 'Fehlende Daten für das Löschen.';
      console.error('Fehler: Ungültige Eingaben für das Löschen.');
      return false;
    }
    return true;
  }

// 2. Holt einen Kommentar basierend auf seiner ID
  private getCommentById(commentId: number): any {
    const comment = this.comments.find((comment) => comment.id === commentId);

    if (!comment) {
      this.error = 'Kommentar nicht gefunden.';
      console.error('Fehler: Kommentar nicht gefunden.');
    }

    return comment;
  }

// 3. Überprüft, ob der Benutzer den Kommentar löschen darf
  private canDeleteComment(comment: any, username: string, isAdmin: boolean): boolean {
    if (!comment) {
      return false;
    }

    const isAuthor = comment.username === username;
    if (!isAdmin && !isAuthor) {
      this.error = 'Sie dürfen diesen Kommentar nicht löschen.';
      console.error('Fehler: Benutzer nicht autorisiert, diesen Kommentar zu löschen.');
      return false;
    }

    return true;
  }

// 4. Führt die Löschung des Kommentars durch
  private performCommentDeletion(commentId: number, isAdmin: boolean): void {
    this.activityService.deleteComment(commentId, isAdmin).subscribe(
      () => {
        console.log(`Kommentar mit ID ${commentId} erfolgreich gelöscht.`);

        // Kommentarinhalt lokal aktualisieren
        const commentIndex = this.comments.findIndex((comment) => comment.id === commentId);
        if (commentIndex !== -1) {
          this.comments[commentIndex].content = isAdmin
            ? '[Vom Admin entfernt.]'
            : '[Vom Autor entfernt.]';
        }
      },
      (error) => {
        console.error(`Fehler beim Löschen des Kommentars mit ID ${commentId}:`, error);
        this.error = 'Fehler beim Löschen des Kommentars. Bitte versuchen Sie es erneut.';
      }
    );
  }



}
