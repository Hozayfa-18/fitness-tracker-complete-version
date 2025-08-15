import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Activity, Visibility} from "../model/activity";
import {Observable} from "rxjs";//Observable erlaubt empfangen von asynchrone Daten (observable)(return von HTTP-Anfrage) ohne
//Observable ist nützlich in Anwendungen, die viele Daten von APIs laden oder auf Benutzereingaben reagieren müssen.

@Injectable({
  providedIn: 'root'
})
export class ActivityServiceService {

  private activityURL: string;
  private baseUrl = 'http://localhost:8080/activities/pictures';
  private url = 'http://Localhost:8080/likes';
  private comments = 'http://Localhost:8080/comments';

  constructor(private http: HttpClient) {
    this.activityURL = 'http://localhost:8080/activities'
  }

  //So wir ein RequestParam aufgerufen
  getAllActivities(): Observable<any[]>{
    return this.http.get<Activity[]>(this.activityURL)
  }

  getVisibleActivitiesForUser(username:string): Observable<any>{
    return this.http.get<Activity[]>(`${this.activityURL}/visible-activities?username=${username}`)
  }

  getUsernameByUserId(userId:number): Observable<any>{
    return this.http.get<String>(`${this.activityURL}/findUsernameByUserId?userId=${userId}`)
  }

  getActivityByUserName(username: string): Observable<any> {
    return this.http.get<Activity[]>(`${this.activityURL}/username?username=${username}`);
  }

  getCountActivityByUserName(username: string|null): Observable<any> {
    return this.http.get<number>(`${this.activityURL}/countActivities/username?username=${username}`);
  }

  getTotalDurationByUsername(username: string|null) {
    return this.http.get<number>(`${this.activityURL}/totalDuration/username?username=${username}`);
  }

  getTotalDistanceByUsername(username: string|null) {
    return this.http.get<number>(`${this.activityURL}/totalDistance/username?username=${username}`);
  }

  getTotalCaloriesByUsername(username: string|null) {
    return this.http.get<number>(`${this.activityURL}/totalCalories/username?username=${username}`);
  }

  getTotalElevationGainByUsername(username: string|null) {
    return this.http.get<number>(`${this.activityURL}/totalElevationGain/username?username=${username}`);
  }

  getAverageSpeedByUsername(username: string|null) {
    return this.http.get<number>(`${this.activityURL}/averageSpeed/username?username=${username}`);
  }

  getMaxAverageSpeedByUsername(username: string|null) {
    return this.http.get<number>(`${this.activityURL}/maxAverageSpeed/username?username=${username}`);
  }

  //Nimmt als parameter ein Objekt vom typ activity entgegen und schickt dieses an den Server, damit dieser den Activity speichert.
  public creatAndSaveActivity(formData: FormData) {
    return this.http.post<Activity>(this.activityURL + "/create", formData);
  }
  getElevationData(activityId: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.activityURL}/${activityId}/elevation-visualization`);
  }


  //getActivityById(activityId: number): Observable<Activity> {
   // return this.http.get<Activity>(`${this.activityURL}/${activityId}`);
 // }

  getRoute(activityId: number): Observable<any> {
    return this.http.get<any>(`${this.activityURL}/${activityId}/route`);
  }

  // alle GPS-Koordinaten abrufen, die mit einer bestimmten Aktivität verknüpft sind
  getGPXCoordinates(activityId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.activityURL}/${activityId}/gpx-coordinates`);
  }

  // Bild abrufen basierend auf GPS-Daten
  getPictureByGpxDataId(gpxDataId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${gpxDataId}`);
  }

  // Bild löschen
  deletePicture(pictureId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${pictureId}`, { responseType: 'text' });
  }
  getMonthlyStatistics(username: string, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.activityURL}/monthlyStatistics?username=${username}&year=${year}`, {
      headers: { Accept: 'application/json' },
    });
  }




  // Methode zum Liken einer Aktivität
  likeActivity(activityId: number, username: string):Observable<void> {
    return this.http.post<void>(`${this.url}/${activityId}/like?username=${username}`, {});
  }

  // Methode zum Entfernen eines Likes
  unlikeActivity(activityId: number, username: string): Observable<void> {
    return this.http.post<void>(`${this.url}/${activityId}/unlike?username=${username}`, {});
  }

  // Methode zum Überprüfen, ob eine Aktivität vom Benutzer geliked wurde
  isActivityLiked(activityId: number, username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/${activityId}/isLiked?username=${username}`);
  }

  // Methode zum Zählen der Likes einer Aktivität
  countLikesForActivity(activityId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/${activityId}/count`);
  }

  // Methode zum Zählen der Likes eines Benutzers
  countLikesForUser(username: string): Observable<number> {
    return this.http.get<number>(`${this.url}/user/${username}/count`);
  }


  getCommentsForActivity(activityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.comments}/activity/${activityId}`);
  }

  addComment(commentPayload: any): Observable<any> {
    return this.http.post<any>(`${this.comments}/`, commentPayload);
  }

  deleteComment(commentId: number, isAdmin: boolean): Observable<void> {
    const payload = { username: localStorage.getItem('username'), isAdmin };
    return this.http.put<void>(`${this.comments}/${commentId}/delete`, payload);
  }


}

