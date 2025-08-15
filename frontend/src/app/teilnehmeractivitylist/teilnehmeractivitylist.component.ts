import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Activity} from "../model/activity";
import {ActivityServiceService} from "../service/activity-service.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-teilnehmeractivitylist',
  templateUrl: './teilnehmeractivitylist.component.html',
  styleUrl: './teilnehmeractivitylist.component.css'
})
export class TeilnehmeractivitylistComponent implements OnInit{
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  sortAscending: boolean = true;
  currentSortAttribute: string = '';
  error: string | null = null;

  constructor(private route: ActivatedRoute,private activityService: ActivityServiceService) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.loadActivities(username);
    } else {
      this.error = 'Kein Benutzer eingeloggt.';
    }
  }

  loadActivities(username: string): void {
    this.activityService.getActivityByUserName(username)
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.filteredActivities = data;
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

}
