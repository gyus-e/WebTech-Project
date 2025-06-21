import { Component, inject } from '@angular/core';
import { RestBackendAuthService } from '../../_services/rest-backend/rest-backend-auth.service';
import { AuthFormComponent } from '../auth-form/authForm.component';


@Component({
  selector: 'app-signup',
  imports: [AuthFormComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  restService = inject(RestBackendAuthService);
}
