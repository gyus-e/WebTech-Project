import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../_services/auth/auth.service';
import { AuthRequest } from '../../_types/auth-request.type';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RestBackendErrorHandlerService } from '../../_services/rest-backend/rest-backend-error-handler.service';


export type authFormData = { user: string, password: string };
type restServiceAuthFun = (req: AuthRequest) => Observable<string>;

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule],
  templateUrl: './authForm.component.html',
  styleUrl: './authForm.component.scss'
})
export class AuthFormComponent {
  @Input() title: string = '';
  @Input() button_text: string = '';
  @Input() require_password_confirmation: boolean = false;
  @Input() restservice_auth_fun: restServiceAuthFun | null = null;

  toastr = inject(ToastrService);
  router = inject(Router);
  authService = inject(AuthService);
  errHandler = inject(RestBackendErrorHandlerService);

  submitted: boolean = false;
  authForm = new FormGroup({
    user: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)
    ]),
    password_confirmation: new FormControl('', [])
  });


  handleAuth() {
    if (!this.restservice_auth_fun) {
      throw new Error("No authentication function provided!");
    }

    this.submitted = true;

    if (
      this.require_password_confirmation && this.authForm.value.password !== this.authForm.value.password_confirmation
    ) {
      this.toastr.error("Passwords do not match!", "Error: invalid form data");
      return;
    }

    if (this.authForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Error: invalid form data");
      return;
    }

    this.restservice_auth_fun({
      usr: this.authForm.value.user!,
      pwd: this.authForm.value.password!,
    }).subscribe({

      next: (token) => {
        this.authService.updateToken(token).then(() => {

          this.toastr.success(`Welcome ${this.authForm.value.user}!`, `Success!`);
          setTimeout(() => { this.router.navigateByUrl("/") }, 10);

        });
      },

      error: (err) => {
        this.errHandler.handleError(err);
      },

      complete: () => {

      }
    })
  }

}

