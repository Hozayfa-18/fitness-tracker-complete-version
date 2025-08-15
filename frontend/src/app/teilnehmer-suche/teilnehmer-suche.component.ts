import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {EditProfileService} from "../service/edit-profile.service";
import {UserServiceService} from "../service/user-service.service";
import {Router} from "@angular/router";
import {map} from "rxjs";

@Component({
  selector: 'app-teilnehmer-suche',
  templateUrl: './teilnehmer-suche.component.html',
  styleUrl: './teilnehmer-suche.component.css'
})
export class TeilnehmerSucheComponent implements OnInit{
  users: User[] = [];
  username: string='';

  constructor(private router: Router,private userService: UserServiceService) {
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe(
      (data) =>{
        this.users = data;
      })
  }

  findUser(username: string) {
    if (username.trim() === '') {
      this.userService.findAll().subscribe(
        (data) => {
          this.users = data;
        }
      );
    } else {
      this.userService.findAll()
        .pipe(
          map((data) =>
            data.filter((user: any) =>
              user.username.toLowerCase().includes(username.toLowerCase())
            )
          )
        )
        .subscribe({
          next: (filteredUsers) => {
            this.users = filteredUsers;
          },
          error: (error) => {
            console.error('Error fetching users:', error);
          },
          complete: () => {
            console.log('User search completed successfully');
          }
        });
    }
  }

  goToUserDetails(username: string | undefined): void {
    this.router.navigate(['/usersSearch', username]);
  }


  reset(){
    window.location.reload()
  }
}

