import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  constructor() { }

  private isOpen = new BehaviorSubject<boolean>(false);
  private userData = new BehaviorSubject<any>(null);
  private updatedUserData = new BehaviorSubject<any>(null);

  isOpen$ = this.isOpen.asObservable();
  userData$ = this.userData.asObservable();
  updatedUserData$ = this.updatedUserData.asObservable();

  open(user: any): void {
    this.userData.next(user);
    this.isOpen.next(true);
  }

  close(): void {
    this.isOpen.next(false);
    this.userData.next(null);
  }

}
