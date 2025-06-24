import { Component, effect, inject, Input, signal } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RestBackendUploadService } from '../_services/rest-backend/rest-backend-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule, MapComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  uploadService = inject(RestBackendUploadService);
  catId = signal<number | undefined>(undefined);
  multipartFormData = signal<FormData|undefined>(undefined);


  uploadForm = new FormGroup({
    // cat: new FormControl('', [
    //   Validators.required,
    // ]),
    title: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl(''),
    geolocation: new FormControl('', [
      // Validators.required,
    ]),
    photo: new FormControl(null, [
      Validators.required,
      // Validators.pattern('^.*\.(jpg|jpeg|png|gif)$') // Example pattern for image files
    ])
  });


  constructor() {
    effect(() => {

      if (this.catId() && this.multipartFormData()?.has('photo')) {
        this.uploadService.postPhoto(this.catId()!, this.multipartFormData()!).subscribe({

          next: (response: any) => {
            this.toastr.success('Photo uploaded successfully!'); 
            console.log(response);
            this.uploadForm.reset();
            setTimeout(() => { this.router.navigateByUrl("/") }, 10);
          },

          error: (error: any) => {
            this.toastr.error('Failed to upload photo.');
            console.log(error);
          }

        });
      }

    });
  }


  onFileSelected(event: any): void {
    //TODO: Refactor this as an Interceptor
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.patchValue({photo: file});
      this.uploadForm.get('photo')?.updateValueAndValidity();
    }
  }


  onSubmit(): void {
    if (this.uploadForm.invalid) {
      console.error('Form is invalid');
      this.toastr.error('Please fill out all required fields correctly.');
      return;
    }

    // this.uploadService.postCat(this.uploadForm.value.cat!).subscribe({
    //   next: (response) => {
    //     this.catId.set(response.id);
    //   },
    //   error: (error) => {
    //     console.error('Error uploading cat:', error);
    //     this.toastr.error('Failed to upload cat. Please try again.');
    //   }
    // });
    this.catId.set(1); // For testing purposes, set a static catId

    const formData = new FormData();
    formData.append('title', this.uploadForm.value.title!);
    formData.append('description', this.uploadForm.value.description ?? '');
    formData.append('geolocation', this.uploadForm.value.geolocation ?? '');
    formData.append('photo', this.uploadForm.value.photo!);

    this.multipartFormData.set(formData);
  }
}
