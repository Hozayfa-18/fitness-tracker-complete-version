
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Activity } from "../model/activity";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private activityURL: string;

  constructor(private http: HttpClient) {
    this.activityURL = 'http://localhost:8080/activities';
  }

  // Abrufen der Statistiken für eine bestimmte Aktivität.
  public getStatisticsByActivityId(activityId: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.activityURL}/${activityId}`);
  }
}
