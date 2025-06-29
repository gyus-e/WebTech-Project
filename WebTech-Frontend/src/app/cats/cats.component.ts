import { Component, inject, Output, signal } from '@angular/core';
import { CatsStateService } from '../_services/cats/cats-state.service';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RestBackendUploadService } from '../_services/rest-backend/rest-backend-upload.service';
import { AuthService } from '../_services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cats',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.scss'
})
export class CatsComponent {
  catsState = inject(CatsStateService);
  authState = inject(AuthService);
  fetchService = inject(RestBackendFetchService);
  uploadService = inject(RestBackendUploadService);
  router = inject(Router);
  toastr = inject(ToastrService);

  uploadCatForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });


  onSubmit() {
    if (this.uploadCatForm.invalid) {
      console.error('Form is invalid');
      this.toastr.error('Please fill out all required fields correctly.');
      return;
    }

    this.uploadService.postCat(this.uploadCatForm.value.name!).subscribe({
      next: (response) => {
        const cat_id = response.id;
        this.catsState.new_cat.set(cat_id);
        this.toastr.success(`You added ${this.uploadCatForm.value.name}!`, `Success!`);
        this.router.navigate([`/upload`, cat_id]);
      },
      error: (error) => {
        console.error('Error uploading cat:', error);
        this.toastr.error('Failed to upload cat. Please try again.');
      }
    });
  }


  getCatProfilePicUrl(catId: number): string {
    return this.catsState.catProfilePicUrls.get(catId) ?? 'assets/yamamaya.jpg';
  }


}
