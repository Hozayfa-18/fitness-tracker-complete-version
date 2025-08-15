import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  menuOpen: boolean = false; // Menü ist standardmäßig geschlossen

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.menuOpen = false;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Wechsel zwischen geöffnet und geschlossen
  }

  closeMenu() {
    this.menuOpen = false;
  }

}
