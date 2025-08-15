import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend'; //shiva
  currentRoute: string = '';
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
       // this.currentRoute = event.urlAfterRedirects;

        this.showNavbar = !(
          event.url === '' ||
          event.url === '/' ||
          event.url === '/login' ||
          event.url === '/registrierung' ||
          event.url === '/zweifaktor'
        );


      }
    });
  }


}
