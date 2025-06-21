import { Component, inject } from '@angular/core';
import { RestBackendAuthService } from '../../_services/rest-backend/rest-backend-auth.service';
import { AuthFormComponent } from '../auth-form/authForm.component';


@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  restService = inject(RestBackendAuthService);
}
