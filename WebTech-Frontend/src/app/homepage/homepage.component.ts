import { Component, inject } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { MapComponent } from '../map/map.component';
import { CatUploadFormComponent } from '../cat-upload-form/cat-upload-form.component';

@Component({
  selector: 'app-homepage',
  imports: [MapComponent, CatUploadFormComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  authState = inject(AuthService);
}
