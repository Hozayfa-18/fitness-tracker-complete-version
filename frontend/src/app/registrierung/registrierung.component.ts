import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-registrierung',
  templateUrl: './registrierung.component.html',
  styleUrls: ['./registrierung.component.css']
})
export class RegistrierungComponent implements OnInit{
  selectedRole: string = ''; // Standard auf 'user' gesetzt
  selectedFile: File | null = null;
  profilePicture: File | null = null;
  private form: any;
  errorMessage: string = '';
  username: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  gender: string = '';
  weight: number | null = null;
  height: number | null = null;
  birthDate: Date | null = null;

  constructor(
    private router: Router,
    private service: UserServiceService
  ) {}

  ngOnInit() {
  }

  // Methode zur Behandlung der Bildauswahl
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Profilbild ausgewählt:', this.selectedFile.name);
    }

  }

  onSubmit(form: NgForm): void {
    if (!this.isFormValid(form)) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }
    const formData = new FormData();

    // Basisdaten für alle Rollen
    const registrationData: any = {
      username: form.value.username,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      role: this.selectedRole,
    };

    // Zusätzliche Felder nur für normale Benutzer
    if (this.selectedRole === 'user') {
      registrationData.birthDate = form.value.birthDate || '';
      registrationData.height = form.value.height || '';
      registrationData.weight = form.value.weight || '';
      registrationData.gender = form.value.gender || '';
    }

    // JSON-Daten als Blob hinzufügen
    formData.append('registrationData', new Blob([JSON.stringify(registrationData)], { type: 'application/json' }));

    // Falls ein Profilbild ausgewählt wurde, es zur FormData hinzufügen
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    }
    console.log('Formularinhalt:', formData);

    // Registrierungsdaten senden
    this.submitData(formData);
    console.log(registrationData);
    console.log(formData);
  }


  // Methode zum Senden der Registrierungsdaten
    submitData(formData: FormData): void {
      this.service.registrierung(formData).subscribe({
        next: () => {
          console.log('Registrierung erfolgreich!');
          alert('Registrierung erfolgreich!');
          this.router.navigate(['/login']); // Weiterleitung zur Login-Seite
        },
        error: (errorResponse) => {
          console.error('Registrierung fehlgeschlagen:', errorResponse);
          this.errorMessage = errorResponse.error || 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.';
        }
      });
    }

  isFormValid(form: NgForm): boolean {
    if (!form.valid) return false;

    if (this.selectedRole === 'user') {
      return (
        form.value.birthDate &&
        form.value.height &&
        form.value.weight &&
        form.value.gender &&
        form.value.username &&
        form.value.firstName &&
        form.value.lastName &&
        form.value.email &&
        form.value.password
      );
    }

    if (this.selectedRole === 'admin') {
      return (
        form.value.username &&
        form.value.firstName &&
        form.value.lastName &&
        form.value.email &&
        form.value.password
      );
    }
    return false; // Keine Rolle ausgewählt
  }


}
