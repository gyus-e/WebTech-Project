import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../_services/auth/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    } else {    
      this.toastr.warning("Stop messing with the URL!", "Warning: not logged in");
    }
    this.router.navigateByUrl('/');;
  }
}
