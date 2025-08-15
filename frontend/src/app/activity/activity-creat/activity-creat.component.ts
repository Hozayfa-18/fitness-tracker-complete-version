import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Activity} from "../../model/activity";
import {ActivityServiceService} from "../../service/activity-service.service";
import {UserServiceService} from "../../service/user-service.service";
import { NgForm } from '@angular/forms';
import {User} from "../../model/user";


@Component({
  selector: 'app-activity',
  templateUrl: './activity-creat.component.html',
  styleUrl: './activity-creat.component.css'

})

export class ActivityCreatComponent{
  activity: Activity;
  users:User[]=[]
  uploadError = false;
  isUploading = false;

  error: string | null = null;

  @ViewChild('activityData') activityData!: ElementRef; // Zugriff auf das Datei-Input-Feld
  constructor(private router: Router,
              private activityService: ActivityServiceService,
              private userService: UserServiceService,)
  {
    this.activity = new Activity();
  }

  // Methode, um eine Datei zu überprüfen und zu speichern
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.activity.activityData = input.files[0];
    }
  }

  onSubmit(activityForm: NgForm): void {
    const username = localStorage.getItem('username'); // Username des eingeloggten Benutzers
    if(!username){
      this.error = 'Kein Benutzer eingeloggt.';
    }
    this.userService.findByUsername(username).subscribe(
      (data) => {
        this.activity.user = data;
    if ((username) && (this.activity.user.role !== "admin") ) {
      if (activityForm.valid) {
        const formData = new FormData();

        // Füge die Aktivitätsdaten zum FormData-Objekt hinzu
        formData.append('activityName', this.activity.activityName || '');
        formData.append('activityType', this.activity.activityType || '');
        formData.append('visibility', this.activity.visibility || '');
        formData.append('username', username.toString());
        if (this.activity.activityData) {
          formData.append('file', this.activity.activityData);
          this.isUploading = true;
        }
        // Sende die FormData an den Service zur Erstellung der Aktivität
        this.activityService.creatAndSaveActivity(formData).subscribe({
          next: (createdActivity: Activity) => {
            // Überprüfen, ob die Aktivität und ihre ID vorhanden sind
            if (createdActivity && createdActivity.id) {
              // Navigiere zur Statistik-Seite der neu erstellten Aktivität.
              this.router.navigate(['/statistics', createdActivity.id]);
            } else {
              this.uploadError = true;
              console.error("Keine gültige Aktivitäts-ID erhalten.");
            }
            activityForm.resetForm();
            this.resetFileInput();
            this.isUploading = false;
          },
          error: (err) => {
            this.isUploading = false;
            this.uploadError = true;
            console.error("Fehler beim Erstellen der Aktivität:", err);
          }
        });
      }
    }
    if(this.activity.user.role === "admin") {
      this.error = 'Als Admin dürfen Sie keine Aktivitäten erstellen!';
    }
    })
  }

  resetFileInput(): void {
    if (this.activityData) {
      this.activityData.nativeElement.value = ''; // Datei-Input zurücksetzen
    }
  }
}
