import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserServiceService} from "../service/user-service.service";
import {EditProfileService} from "../service/edit-profile.service";
import {identity} from "rxjs";
import {ActivityServiceService} from "../service/activity-service.service";
import {Activity} from "../model/activity";
import {HttpClient} from "@angular/common/http";
import {AddProfilePictureComponent} from "../add-profile-picture/add-profile-picture.component";

@Component({
  selector: 'app-benutzerprofile',
  templateUrl: './benutzerprofile.component.html',
  styleUrls: ['./benutzerprofile.component.css']
})
export class BenutzerprofileComponent implements OnInit{
  users: User[] = [];
  activitiesCount: number=0;
  totalDurationInHours: number = 0;
  totalDistanceInKm: number = 0;
  totalCaloriesInK: number = 0;
  totalElevationGainInM: number=0;
  averageSpeedInKmh: number=0;
  maxAverageSpeedInKmh: number =0;
  searchId: number=0;
  activities: Activity[] = []; // Hier werden die Aktivitäten gespeichert
  filteredActivities: Activity[] = []; //neue Liste zeigen nach eine Suche- odere Sortierfunktion
  sortAscending: boolean = true; // Sortierrichtung
  currentSortAttribute: string = ''; // Aktuelle Sortierspalte
  error: string | null = null;
  ppName: string|null=null;
  retrievedImage: string | null = null;
  base64Data: any;
  retrieveResponse: any;
  message: string = '';
  username: string = '';
  //profileImageUrl: string | null = null;
  user: User | null = null;
  freundesliste: any[] = [];
  sichtbarkeit: boolean = false; // Sichtbarkeit der Freundesliste
   isAdmin: boolean = false;
  totalLikes: number | null =null;

  profileImageUrl: string | ArrayBuffer |null | undefined = './assets/Bilder/SEP-Move_Logo_Minimalistic.png';

  //user = {
   // name: 'gg hh',
   // bio: 'hello world',
   // email: 'gg.hh@example.com',
   // location: 'Essen, NRW',
   // website: 'https://gg.com',
   // joined: 'January 2020',
   // profilePicture: ''
  //};


  constructor(private httpClient: HttpClient,
              private activityService: ActivityServiceService,
              private editProfileModalService: EditProfileService,
              private userService: UserServiceService) {
  }

  openEditModal(): void {
    const username  = localStorage.getItem('username');
    this.userService.findByUsername(username).subscribe(
      (data) =>{
        this.users = [data];
      })
    this.userService.open();
  }

  ngOnInit(): void {
    //this.getImage();
    const username  = localStorage.getItem('username');
    this.userService.findByUsername(username).subscribe(
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
      this.loadFreundesliste(username)

      this.loadActivities(username);
      this.loadProfilePicture(); // Profilbild laden
    } else {
      this.error = 'Kein Benutzer eingeloggt.';
    }
    //this.editProfileModalService.updatedUserData$.subscribe(updatedUser => {
    //  if (updatedUser) {
    //    this.user = updatedUser;
    //  }
    //});

    //this.loadProfilePicture(); // Profilbild laden
  }

  /*
  onProfileUpdated(updatedProfile: any) {
    // Update the local user data with the updated profile information
    this.users = this.users.map(user =>
      user.username === updatedProfile.username ? { ...user, ...updatedProfile } : user
    );
  }
   */

  createActivity() {
    this.userService.goTo('activitycreat')
  }

  countActivities(){
    const username  = localStorage.getItem('username');
    this.activityService.getCountActivityByUserName(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.activitiesCount = data
      }
    })
  }

  sumActivitiesTotalDuration(){
    const username  = localStorage.getItem('username');
    this.activityService.getTotalDurationByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalDurationInHours = data
      }
    })
  }

  sumActivitiesTotalDistance(){
    const username  = localStorage.getItem('username');
    this.activityService.getTotalDistanceByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalDistanceInKm = data
      }
    })
  }

  sumActivitiesTotalCalories(){
    const username  = localStorage.getItem('username');
    this.activityService.getTotalCaloriesByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalCaloriesInK = data
      }
    })
  }

  sumActivitiesTotalElevationGain(){
    const username  = localStorage.getItem('username');
    this.activityService.getTotalElevationGainByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.totalElevationGainInM = data
      }
    })
  }

  getAverageSpeed(){
    const username  = localStorage.getItem('username');
    this.activityService.getAverageSpeedByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.averageSpeedInKmh = data
      }
    })
  }

  getMaxAverageSpeed(){
    const username  = localStorage.getItem('username');
    this.activityService.getMaxAverageSpeedByUsername(username).subscribe({
      next: (data ) => {
        console.log(data)
        this.maxAverageSpeedInKmh = data
      }
    })
  }

  loadActivities(username: string): void {
    this.activityService.getActivityByUserName(username)
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.filteredActivities = data;
          this.loadTotalLikes(username)
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
    const username = localStorage.getItem('username');
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
    const username = localStorage.getItem('username')
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

  //protected readonly identity = identity;

  loadFreundesliste(username: string): void {
    this.userService.getFriends(username).subscribe(
      (friends) => {
        this.freundesliste = friends;
      },
      (error) => console.error('Fehler beim Laden der Freundesliste:', error)
    );
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


}
