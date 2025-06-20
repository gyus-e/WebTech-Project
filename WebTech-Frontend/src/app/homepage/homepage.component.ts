import { Component, inject } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  authService = inject(AuthService);
}
