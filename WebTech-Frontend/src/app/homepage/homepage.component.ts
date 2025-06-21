import { Component, inject } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-homepage',
  imports: [MapComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  authService = inject(AuthService);
}
