import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    } else {    
      // this.toastr.warning("You are not logged in.");
    }
    this.router.navigateByUrl('/');;
  }
}
