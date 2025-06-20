import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendAuthService } from '../_services/rest-backend/rest-backend-auth.service';


@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  router = inject(Router);
  toastr = inject(ToastrService);
  restService = inject(RestBackendAuthService);
  authService = inject(AuthService);
  submitted = false;
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)
    ])
  })


  handleLogin() {
    this.submitted = true;
    if(this.loginForm.invalid){
      this.toastr.error("The data you provided is invalid!", "Error: invalid form data");
      return;
    }
    this.restService.login({
      usr: this.loginForm.value.user as string,
      pwd: this.loginForm.value.password as string,
    }).subscribe({
      next: (token) => {
        this.authService.updateToken(token).then( ()=> {
          this.toastr.success(`Welcome ${this.loginForm.value.user}!`, `Login successful!`);
          setTimeout(() => {this.router.navigateByUrl("/")}, 10);
        });
      },
      error: (err) => {
        this.toastr.error("Incorrect email or password", "Error: login failed");
      },
      complete: () => {
        
      }
    })
  }
}
