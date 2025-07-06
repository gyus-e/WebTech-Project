import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RestBackendUploadService } from '../_services/rest-backend/rest-backend-upload.service';
import { Router } from '@angular/router';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';

@Component({
  selector: 'app-cat-upload-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cat-upload-form.component.html',
  styleUrl: './cat-upload-form.component.scss'
})
export class CatUploadFormComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  errService = inject(RestBackendErrorHandlerService);
  uploadService = inject(RestBackendUploadService);

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
        this.toastr.success(`You added ${this.uploadCatForm.value.name}!`, `Success!`);
        this.router.navigate([`/upload`, response.id]);
      },
      error: (error) => {
        this.errService.handleError(error);
      }
    });
  }

}
