import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RestBackendUploadService } from '../_services/rest-backend/rest-backend-upload.service';
import { AuthService } from '../_services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';
import { CatResponse } from '../_types/cat-response.type';
import { REST_BACKEND_URL } from '../_config/rest-backend-url';

//TODO: move somewehre else
const PLACEHOLDER = 'assets/yamamaya.jpg';


@Component({
  selector: 'app-cats',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.scss'
})
export class CatsComponent {
  authState = inject(AuthService);
  fetchService = inject(RestBackendFetchService);
  uploadService = inject(RestBackendUploadService);
  errService = inject(RestBackendErrorHandlerService);
  router = inject(Router);
  toastr = inject(ToastrService);

  cats = signal<CatResponse[]>([]);

  uploadCatForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });


  constructor() {
    this.fetchService.getCats().subscribe({
      next: (cats) => {
        this.cats.set(cats);
      },
      error: (error) => {
        this.errService.handleError(error);
      }
    });
  }


  onSubmit() {
    if (this.uploadCatForm.invalid) {
      console.error('Form is invalid');
      this.toastr.error('Please fill out all required fields correctly.');
      return;
    }

    this.uploadService.postCat(this.uploadCatForm.value.name!).subscribe({
      next: (response) => {
        this.toastr.success(`You added ${this.uploadCatForm.value.name}!`, `Success!`);
        this.router.navigate([`/upload`, response.id]);
      },
      error: (error) => {
        this.errService.handleError(error);
      }
    });
  }


  getProfilePictureUrl(cat: CatResponse): string {
    if (cat.profilePicture) {
      return `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`;
    }
    return `${PLACEHOLDER}`;
  }
}
