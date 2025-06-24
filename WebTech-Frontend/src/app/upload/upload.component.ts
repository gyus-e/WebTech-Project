import { Component, effect, inject, Input, signal } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RestBackendUploadService } from '../_services/rest-backend/rest-backend-upload.service';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule, MapComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  toastr = inject(ToastrService);
  uploadService = inject(RestBackendUploadService);
  // catId = signal<number | undefined>(undefined);
  // submitted = signal<boolean>(false);


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
    // effect(() => {
    //   if (this.submitted() /*&& this.catId()*/) {
    //     this.uploadService.postPhoto(1, this.uploadForm).subscribe({
    //       next: (response: any) => {},
    //       error: (error: any) => {}
    //     });
    //   }
    // });
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.patchValue({photo: file});
      this.uploadForm.get('photo')?.updateValueAndValidity();
    }
  }


  onSubmit(): void {
    if (this.uploadForm.invalid) {
      // this.uploadForm.markAllAsTouched();
      console.error('Form is invalid');
      this.toastr.error('Please fill out all required fields correctly.');
      return;
    }

    // this.uploadService.postCat(this.uploadForm.value.cat!).subscribe({
    //   next: (response: CatResponse) => {
    //     this.catId.set(response.id);
    //   },
    //   error: (error) => {
    //     console.error('Error uploading cat:', error);
    //     this.toastr.error('Failed to upload cat. Please try again.');
    //   }
    // });

    // this.submitted.set(true);

    const multipartFormData = new FormData();
    multipartFormData.append('title', this.uploadForm.value.title!);
    multipartFormData.append('description', this.uploadForm.value.description ?? '');
    multipartFormData.append('geolocation', this.uploadForm.value.geolocation ?? '');
    multipartFormData.append('photo', this.uploadForm.value.photo!);

    this.uploadService.postPhoto(1, multipartFormData).subscribe({
      next: (response: any) => {
        this.toastr.success('Photo uploaded successfully!'); 
        console.log(response);
      },
      error: (error: any) => {
        this.toastr.error('Failed to upload photo.');
        console.log(error);
      }
    });
  }
}
