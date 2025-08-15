import { Component } from '@angular/core';
import {UserServiceService} from "../service/user-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-zweifaktor',
  templateUrl: './zweifaktor.component.html',
  styleUrl: './zweifaktor.component.css'
})
export class ZweifaktorComponent {
  username: string = '';
  authCode: string = '';
  errorMessage: string | null = null;

  constructor(
              private service: UserServiceService,
              private router: Router) {
  }

  onSubmit() {
    console.log('Username' + this.username)
      console.log('code' + this.authCode)
    const zweiFaktorObjekt = {
      username: this.username,
      authCode: this.authCode
    };


      this.service.faktor(zweiFaktorObjekt).subscribe(
          (response: any) => {
              console.log('Zwei-Faktor-Authentifizierung erfolgreich:', response);
              this.errorMessage = null;


              if (response && response.username) {
                  localStorage.setItem('username', response.username);
              } else {
                  console.error('Unerwartetes Antwortformat:', response);
              }
              this.router.navigate(['/homepage']);
          },
          error => {
              console.error('Fehler bei der Zwei-Faktor-Authentifizierung:', error);

              // Überprüfen, welche Art von Fehler zurückgegeben wird
              if (error.status === 400 || error.status === 404) {
                  this.errorMessage = "Der eingegebene Benutzername ist ungültig. Bitte überprüfen Sie Ihre Eingabe.";
              } else if (error.status === 401 || error.status === 403) {
                  this.errorMessage = "Der Authentifizierungscode ist ungültig oder abgelaufen. Bitte versuchen Sie es erneut oder fordern Sie einen neuen Code an.";
              } else {
                  this.errorMessage = "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
              }
          }
      );


  }


    clearMessages() {
        this.errorMessage = null;
    }

}
