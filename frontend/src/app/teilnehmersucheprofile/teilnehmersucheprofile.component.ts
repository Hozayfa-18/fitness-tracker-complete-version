import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from "../model/user";
import {UserServiceService} from "../service/user-service.service";
import {AppComponent} from "../app.component";
import {ActivityServiceService} from "../service/activity-service.service";
import {Activity, Visibility} from "../model/activity";


@Component({
  selector: 'app-teilnehmersucheprofile',
  templateUrl: './teilnehmersucheprofile.component.html',
  styleUrl: './teilnehmersucheprofile.component.css'
})
export class TeilnehmersucheprofileComponent implements OnInit{
  users: User[] = [];
  activitiesCount: number=0;
  totalDurationInHours: number = 0;
  totalDistanceInKm: number = 0;
  totalCaloriesInK: number = 0;
  totalElevationGainInM: number=0;
  averageSpeedInKmh: number=0;
  maxAverageSpeedInKmh: number =0;
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  sortAscending: boolean = true;
  currentSortAttribute: string = '';
  error: string | null = null;
  retrievedImage: string | null = null;
  base64Data: any;
  retrieveResponse: any;
  message: string = '';
  user: User | null = null;
  freundesliste: any[] = [];
  sichtbarkeit: boolean = false; // Sichtbarkeit der Freundesliste
   isAdmin: boolean = false; // Admin-Status
  friendlistVisible: boolean = false;
  errorMessage: string = '';
  loading: boolean = true;
  likeCount: number | null =null;
  isLiked: boolean = false;
  totalLikes: number | null =null;
  sichtbar: boolean = false;

  profileImageUrl: string | ArrayBuffer |null | undefined = './assets/Bilder/SEP-Move_Logo_Minimalistic.png';

  selectedActivityId: number | null = null; // Speichert die ID der Aktivität für Kommentare
  newComment: string = ''; // Der neue Kommentar
  comments: any[] = [];
  username: string = '';
  content: string = '';
  timestamp: any;

  //Achivement-Teil-Anfang
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
  //Achivement-Teil-Ende


  constructor(private route: ActivatedRoute,
              private router:Router,
              private userService: UserServiceService,
              private activityService: ActivityServiceService) {
  }

  ngOnInit(): void {
    this.getImage();

    const username = this.route.snapshot.paramMap.get('username');
    const loggedInusername = localStorage.getItem('username')

    if(username === loggedInusername){
      this.router.navigate(['/users'])
    }
    console.log(username)
    this.userService.findTeilnehmerByUsername(username).subscribe(
      (data) =>{
        this.users = [data];
      })
    this.countActivities();
    this.sumActivitiesTotalDuration();
    this.sumActivitiesTotalDistance();
    this.sumActivitiesTotalCalories();
    this.sumActivitiesTotalElevationGain();
    this.getAverageSpeed();
    this.getMaxAverageSpeed();



    if (username) {
      this.loadActivities(username);
      this.loadProfilePicture();
      this.loadFreundesliste()
      this.loadTotalLikes(username)
      this.loadAchievements(username)

    } else {
      this.error = 'Kein Benutzer eingeloggt.';
    }
  }


  viewActivities() {
    const username = this.route.snapshot.paramMap.get('username');
    this.userService.goTo(`usersSearch/activitylist/${username}`)
  }

  countActivities(){
    const username  = this.route.snapshot.paramMap.get('username');
    this.activityService.getCountActivityByUserName(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.activitiesCount = data
      }
    })
  }

  sumActivitiesTotalDuration(){
    const username  = this.route.snapshot.paramMap.get('username');
    this.activityService.getTotalDurationByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalDurationInHours = data
      }
    })
  }

  sumActivitiesTotalDistance(){
    const username  = this.route.snapshot.paramMap.get('username');
    this.activityService.getTotalDistanceByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalDistanceInKm = data
      }
    })
  }

  sumActivitiesTotalCalories(){
    const username  = this.route.snapshot.paramMap.get('username');
    this.activityService.getTotalCaloriesByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalCaloriesInK = data
      }
    })
  }

  sumActivitiesTotalElevationGain(){
    const username  = this.route.snapshot.paramMap.get('username');
    this.activityService.getTotalElevationGainByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalElevationGainInM = data
      }
    })
  }

  getAverageSpeed(){
    const username  = this.route.snapshot.paramMap.get('username');
    this.activityService.getAverageSpeedByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.averageSpeedInKmh = data
      }
    })
  }

  getMaxAverageSpeed(){
    const username  = this.route.snapshot.paramMap.get('username');
    this.activityService.getMaxAverageSpeedByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.maxAverageSpeedInKmh = data
      }
    })
  }

  loadActivities(username: string): void {
    const loggedInusername = localStorage.getItem('username')
    this.activityService.getActivityByUserName(username)
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.filteredActivities = data;
          this.loadLikesCount()

          this.updateLikeStatus(loggedInusername!);
         // this.getActivityVisibility();



        },
        error: (err) => {
          this.error = 'Fehler beim Laden der Aktivitäten. Bitte versuchen Sie es später erneut.';
          console.error(err);
        }
      });
  }

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

  loadProfilePicture(): void {
    const username  = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userService.getProfilePicture(username).subscribe({
        next: (base64Image) => {
          if (base64Image) {
            this.profileImageUrl = `data:image/jpeg;base64,${base64Image}`;
            console.log('Profilbild erfolgreich geladen:', this.profileImageUrl);
          } else {
            // Fallback auf Standard-Profilbild, falls kein Bild verfügbar ist
            this.profileImageUrl = './assets/Bilder/SEP-Move_Logo_Minimalistic.png';
            console.log('Kein Profilbild vorhanden. Standardbild wird verwendet.');
          }
        },
        error: (err) => {
          console.log('Fehler beim Laden des Profilbilds:', err);

          // Fallback auf Standard-Profilbild bei Fehler
          this.profileImageUrl = './assets/Bilder/SEP-Move_Logo_Minimalistic.png';
        }
      });
    } else {
      // Kein Benutzername vorhanden, Standard-Profilbild setzen
      console.error('Kein Benutzer eingeloggt.');
      this.profileImageUrl = './assets/Bilder/SEP-Move_Logo_Minimalistic.png';
    }
  }


  getImage(): void {
    const username  = this.route.snapshot.paramMap.get('username');
    this.userService.getProfilePicture(username).subscribe(
      res => {
        this.retrieveResponse = res;
        this.base64Data = this.retrieveResponse.pic_byte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      });
  }

  reset(){
    window.location.reload()
  }

  loadFreundesliste(): void {
    const username = this.route.snapshot.paramMap.get('username'); // Profilbenutzername aus der URL
    const loggedInusername = localStorage.getItem('username'); // Aktuellen Benutzernamen aus dem LocalStorage holen

    if (loggedInusername && username) {
      this.userService.getVisibleFriends(loggedInusername, username).subscribe(
        (friends) => {
          this.freundesliste = friends;
          console.log('Freundesliste erfolgreich geladen:', this.freundesliste);
        },
        (error) => {
          console.error('Fehler beim Laden der Freundesliste:', error);
          this.errorMessage = 'Fehler beim Laden der Freundesliste. Bitte versuchen Sie es später erneut.';
        }
      );
    } else {
      console.error('Kein Benutzername vorhanden, um die Freundesliste zu laden.');
      this.errorMessage = 'Kein Benutzername vorhanden, um die Freundesliste zu laden.';
    }
  }


  updateLikeStatus(username: string): void {
    this.activities.forEach((activity) => {
      this.activityService.isActivityLiked(activity.id!, username).subscribe(
        (isLiked) => {
          activity.isLiked = isLiked;
        },
        (error) => {
          console.error(`Fehler beim Überprüfen des Like-Status für Aktivität ${activity.id}:`, error);
        }
      );
    });
  }

  likeActivity(activity: any): void {
    const username = localStorage.getItem('username');
    if (username) {

      this.activityService.likeActivity(activity.id, username).subscribe(
        () => {
          this.updateLikeStatus(username);
            this.loadLikesCount();
            this.errorMessage = ''
            console.log(`Aktivität ${activity.id} wurde geliked.`);
        },
        (error) => {
          console.error(`Fehler beim Liken der Aktivität ${activity.id}:`, error);
          if (activity.visibility === 'PRIVATE') {
            this.errorMessage = 'Diese Aktivität kann nur von Admins geliked werden.';
            return;
          }

          if (activity.visibility === 'FRIENDS') {
            this.errorMessage = 'Diese Aktivität kann nur von Freunden und Admins geliked werden.';
            return;
          }
        }
      );
    }
  }

  unlikeActivity(activity: any): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.activityService.unlikeActivity(activity.id, username).subscribe(
        () => {
          this.updateLikeStatus(username);
            this.loadLikesCount();
            this.errorMessage = ''
            console.log(`Aktivität ${activity.id} wurde entliked.`);
        },
        (error) => {
          console.error(`Fehler beim Entliken der Aktivität ${activity.id}:`, error);
          this.errorMessage = 'Fehler beim Entliken der Aktivität. Bitte versuchen Sie es später erneut.';
        }
      );
    }
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
    });
  }
  loadTotalLikes(username: string): void {
    this.activityService.countLikesForUser(username).subscribe(
      (totalLikes: number) => {
        this.totalLikes = totalLikes;
      },
      (error) => {
        console.error(`Fehler beim Laden der Gesamtanzahl der Likes für Benutzer ${username}:`, error);
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


  // Achivements-Teil
  loadAchievements(username: string): void {
    // 1. Lade alle Aktivitäten des Benutzers
    this.activityService.getActivityByUserName(username).subscribe({
      next: (activities: any[]) => {

        // Überprüfe jede Aktivität
        for (let activity of activities) {
          const distanceInKm = Number((activity.totalDistance/1000).toFixed(2)); // Distanz der Aktivität
          const activityType = activity.activityType;

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
