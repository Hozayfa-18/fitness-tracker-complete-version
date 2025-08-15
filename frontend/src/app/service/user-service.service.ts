import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, EMPTY, Observable} from "rxjs";
import {User} from "../model/user";
import {Image} from "../model/image";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private url = `http://localhost:8080`;

  private isOpen = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router){
  }

  isOpen$ = this.isOpen.asObservable();

  open(): void {
    this.isOpen.next(true);
  }
  close(): void {
    this.isOpen.next(false);
  }

  registrierung(registrierungObjekt: any) {
    return this.http.post(this.url + '/registration/register', registrierungObjekt, {
      responseType: 'text'
    });
  }

  login(loginObjekt: any) {
    return this.http.post(this.url + '/authentification/login', loginObjekt);
  }

  faktor(zweiFaktorObjekt: any) {
    return this.http.post(this.url + '/authentification/zweifaktor', zweiFaktorObjekt);
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem(('imageName'))
    localStorage.removeItem('firstname')
    localStorage.removeItem('lastname')
    localStorage.removeItem('height')
    localStorage.removeItem('weight')
    localStorage.removeItem('gender')
    localStorage.removeItem('role')
    localStorage.removeItem('selectedActivityId')
    this.router.navigate(['/login']);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/usersSearch`);
  }

  getUserById(userId:number): Observable<any>{
    return this.http.get<any>(`${this.url}/${userId}`)
  }

  findByUsername(username: string | null) {
    return this.http.get<User>(`${this.url}/users/username?username=${username}`); //requestparam
  }

  findTeilnehmerByUsername(username: string | null) {
    return this.http.get<User>(`${this.url}/usersSearch/username?username=${username}`); //requestparam
  }

  getProfilePicture(username: string | null): Observable<any> {
    const url = `${this.url}/registration/${username}/profile-picture`;
      return this.http.get(url, {responseType: 'text'});
  }

  updateUserPicture(uploadImageData: FormData): Observable<any> {
    return this.http.put(`${this.url}/image/uploadPP`, uploadImageData, { observe: 'response' });
  }

  updateUserProfile(UserProfileData: FormData){
    return this.http.put(`${this.url}/editProfile/editUserProfile?`, UserProfileData,{ observe: 'response' })
  }

  goTo(nav:string){
    this.router.navigate([`/${nav}`]);
  }

  // Methode, um die Freundesliste eines Benutzers zu holen
  getFriends(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/friendships/friends?username=${username}`);
  }

//Freundschaftsanfrage senden
  addFriend(senderUsername: string, receiverUsername: string): Observable<any> {
    return this.http.post(
      `${this.url}/friendshipRequests/send?senderUsername=${senderUsername}&receiverUsername=${receiverUsername}`,
      {}
    );
  }

  // Methode, um Freundschaftsanfragen zu holen (du kannst diese Methode in deinem Backend hinzufügen, falls nötig)
  getFriendshipRequests(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/friendshipRequests?username=${username}`);
  }


  // Methode, um eine Freundschaft zu entfernen
  removeFriend(username1: string, username2: string): Observable<any> {
    return this.http.delete(`${this.url}/friendships/remove?username1=${username1}&username2=${username2}`);
  }


  // Methode zum Akzeptieren einer Freundschaftsanfrage
  acceptFriendRequest(senderUsername: string, receiverUsername: string): Observable<any> {
    return this.http.post(`${this.url}/friendshipRequests/accept?senderUsername=${senderUsername}&receiverUsername=${receiverUsername}`, {});
  }

  // Methode zum Ablehnen einer Freundschaftsanfrage
  declineFriendRequest(senderUsername: string, receiverUsername: string): Observable<any> {
    return this.http.delete(`${this.url}/friendshipRequests/reject?senderUsername=${senderUsername}&receiverUsername=${receiverUsername}`);
  }

  // Sichtbarkeitsstatus abrufen
  getFriendListVisibility(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/users/${username}/visibility`);
  }

  // Sichtbarkeitsstatus aktualisieren
  updateFriendListVisibility(username: string, isPublic: boolean): Observable<string> {
    return this.http.put(`${this.url}/users/${username}/visibility?isPublic=${isPublic}`, null, {
      responseType: 'text',
    });
  }

  //Sichtbare Freunde anzeigen
  getVisibleFriends(currentUsername: string, profileUsername: string) {
    return this.http.get<User[]>(`${this.url}/friendships/visible-friends?currentUsername=${currentUsername}&profileUsername=${profileUsername}`);
  }

  // Methode zum Hochladen des Bildes und der Metadaten
  uploadPicture(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/activities/pictures/upload`, formData, {
      reportProgress: true,
      responseType: 'text',
      observe: 'events',
    });
  }
  getLoggedInUsername(): string | null {
    return localStorage.getItem('username'); // Benutzername aus localStorage abrufen
  }

}
