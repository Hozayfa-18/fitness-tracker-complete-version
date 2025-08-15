import { Component } from '@angular/core';
import { UserServiceService } from '../service/user-service.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  constructor(private userService: UserServiceService, private route: Router) {}

  onButtonClick(action: string) {

    console.log(`${action} button clicked!`);

    if (action === 'Logout') {
      this.userService.logout();
    }
    if (action === 'Benutzerprofil'){
      this.userService.goTo('users');
    }
    if (action === 'usersSearch'){
      this.userService.goTo(`usersSearch`);
    }
    if (action === 'chat'){
      this.userService.goTo(`chat`);
    }
    if (action === 'Aktivitäten') {
     this.route.navigate(['/activitylist'])
    }

    if (action === 'AktivitätErstellen') {
      this.route.navigate(['/activitycreat'])
    }

    if (action === 'Freundesliste') {
      this.route.navigate(['/freundesliste'])
    }

    if (action === 'leaderboard') {
      this.route.navigate(['/leaderboard'])
    }
    if (action === 'monthly-statistics') {
      this.route.navigate(['/monthly-statistics'])
    }
    if(action === 'socialfeed') {
      this.route.navigate(['/socialfeed'])
    }

  }
}
