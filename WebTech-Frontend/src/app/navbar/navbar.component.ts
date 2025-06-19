import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isOpen = false;
  isDropdownOpen = false;

  //TODO: uncomment when AuthService is done
  // authService = inject('AuthService');

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleNavigationClick(){
    this.isOpen = false;
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
