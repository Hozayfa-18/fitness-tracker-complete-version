import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../service/user-service.service';
import { User } from '../model/user';
import {Router} from "@angular/router";

@Component({
  selector: 'app-freundesliste',
  templateUrl: './freundesliste.component.html',
  styleUrls: ['./freundesliste.component.css']
})
export class FreundeslisteComponent implements OnInit {
  freundesliste: any[] = [];
  freundschaftsanfragen: any[] = [];
  sichtbarkeit: boolean = false;
  benutzerSuche: string = '';  // für die Benutzersuche
  gefundeneBenutzer: User[] = [];  // Liste der Benutzer, die durch die Suche gefunden wurden
  errorMessage: string = '';

  constructor(private userService: UserServiceService,
              private route: Router) {}

  ngOnInit(): void {
    this.loadFreundesliste();
    this.loadFreundschaftsanfragen();

    const loggedInUsername = localStorage.getItem('username');

    if (loggedInUsername) {
      // Sichtbarkeitsstatus abrufen
      this.userService.getFriendListVisibility(loggedInUsername).subscribe(
        (status: boolean) => {
          this.sichtbarkeit = status; // Sichtbarkeit setzen
        },
        (error) => {
          console.error('Fehler beim Abrufen der Sichtbarkeit:', error);
        }
      );
    }
  }

  loadFreundesliste(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.userService.getFriends(username).subscribe(
        (friends) => {
          this.freundesliste = friends;
        },
        (error) => {
          console.error('Fehler beim Laden der Freundesliste:', error);
        }
      );
    }
  }

  searchUser(): void {
    if (this.benutzerSuche) {
      this.userService.findByUsername(this.benutzerSuche).subscribe(
        (user: User) => {
          this.gefundeneBenutzer = [user];  // Wenn der Benutzer gefunden wurde, in die Liste einfügen
        },
        (error) => {
          console.error('Fehler bei der Benutzersuche:', error);
          this.gefundeneBenutzer = [];
        }
      );
    } else {
      this.gefundeneBenutzer = [];
    }
  }

  sendFriendshipRequest(toUsername: string): void {
    const fromUsername = localStorage.getItem('username');
    if (fromUsername && toUsername) {

      if (fromUsername === toUsername) {
        this.errorMessage = 'Du kannst dir selbst keine Freundschaftsanfrage senden.';
        console.warn('Du kannst dir selbst keine Freundschaftsanfrage senden.');
        return;
      } else {
        this.errorMessage = ''; // Setzt bei erfolgreicher Validierung die Fehlermeldung this.errorMessage zurück
      }
      this.userService.addFriend(fromUsername, toUsername).subscribe(
        (response) => {
          console.log(`${toUsername} wurde eine Freundschaftsanfrage gesendet.`);
          this.loadFreundschaftsanfragen();  // Freundschaftsanfragen nach dem Senden aktualisieren
        },
        (error) => {
            console.error('Fehler beim Senden der Freundschaftsanfrage:', error);
            this.errorMessage = 'Ihr seid bereits befreundet oder es besteht bereits eine Freundschaftsanfrage';
        }
      );
    }
  }

  loadFreundschaftsanfragen(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.userService.getFriendshipRequests(username).subscribe(
        (requests) => {
          this.freundschaftsanfragen = requests;
          console.log(this.freundschaftsanfragen);
        },
        (error) => {
          console.error('Fehler beim Laden der Freundschaftsanfragen:', error);
        }
      );
    }
  }


  anfrageAnnehmen(request: any): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.userService.acceptFriendRequest( request.sender?.username, username).subscribe(
        () => {


          this.loadFreundesliste();  // Freundesliste nach Akzeptierung aktualisieren
          this.loadFreundschaftsanfragen();  // Freundschaftsanfragen neu laden
          console.log(`${request.sender?.username} wurde als Freund akzeptiert.`);
        },
        (error) => {
          console.error('Fehler beim Akzeptieren der Freundschaftsanfrage:', error);
        }
      );
    }
  }

  anfrageAblehnen(request: any): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.userService.declineFriendRequest(request.sender?.username, username).subscribe(
        () => {
          this.loadFreundschaftsanfragen();  // Freundschaftsanfragen nach Ablehnung neu laden
          console.log(`${request.sender?.username} wurde abgelehnt.`);
        },
        (error) => {
          console.error('Fehler beim Ablehnen der Freundschaftsanfrage:', error);
        }
      );
    }
  }

  freundEntfernen(friend: any): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.userService.removeFriend(username, friend.username).subscribe(
        () => {
          this.loadFreundesliste();  // Freundesliste nach Entfernen aktualisieren
          console.log(`${friend.username} wurde entfernt.`);
        },
        (error) => {
          console.error('Fehler beim Entfernen des Freundes:', error);
        }
      );
    }
  }


  toggleVisibility(): void {
    const loggedInUsername = localStorage.getItem('username');

    if (!loggedInUsername) {
      console.error('Benutzer nicht eingeloggt.');
      return;
    }

    // Sichtbarkeit umschalten
    this.userService.updateFriendListVisibility(loggedInUsername, !this.sichtbarkeit).subscribe(
      (response) => {
        console.log('Sichtbarkeit aktualisiert:', response);
        this.sichtbarkeit = !this.sichtbarkeit;
        console.log(this.sichtbarkeit);
      },
      (error) => {
        console.error('Fehler beim Aktualisieren der Sichtbarkeit:', error);
      }
    );
  }


  goToProfile(username: string): void {
    console.log(`Profil von ${username} anzeigen`);
    this.route.navigate(['/usersSearch', username]);
  }

  clearMessage(): void {
    this.errorMessage = '';
  }

}
