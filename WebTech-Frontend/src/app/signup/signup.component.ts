import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RestBackendAuthService } from '../_services/rest-backend/rest-backend-auth.service';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  router = inject(Router);
  restService = inject(RestBackendAuthService);
  authService = inject(AuthService);
  submitted = false;
  signupForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)
    ]),
  });

  handleSignup() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      // this.toastr.error("The data you provided is invalid!", "Error: invalid form data");
      return;
    }
    this.restService.signup({
      usr: this.signupForm.value.user as string,
      pwd: this.signupForm.value.password as string,
    }).subscribe({
      next: (token) => {
        this.authService.updateToken(token).then( ()=> {
          // this.toastr.success(`You can now upload cat photos!`, `Welcome ${this.loginForm.value.user}!`);
          setTimeout(() => {this.router.navigateByUrl("/")}, 10);
        });
      },
      error: (err) => {
        // this.toastr.error(err.error, "Error: signup failed");
      },
      complete: () => {

      }
    })
  }
}
