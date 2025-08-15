import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserServiceService} from "../service/user-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private router: Router,
              private service: UserServiceService,
  ) {
  }

  onSubmit() {
    console.log('Benutzername:', this.username);
    console.log('Passwort:', this.password);
    if (!this.username || !this.password) {
      console.error('Benutzername und Passwort sind erforderlich.');
      return;
    }

    const loginObjekt = {
      username: this.username,
      password: this.password
    };


    this.service.login(loginObjekt).subscribe(
      response =>  {
        console.log('Erfolgreich eingeloggt:', response);
        this.errorMessage = null;
        this.router.navigate(['/zweifaktor']);
      },
      error => {
        console.error('Fehler beim Einloggen:', error);
        this.errorMessage = "Passwort oder Benutzername inkorrekt";
      }
    );

  }

  redirectToRegistration() {
    this.router.navigate(['/registrierung']);

  }

  clearMessages() {
    this.errorMessage = null;
  }
}
