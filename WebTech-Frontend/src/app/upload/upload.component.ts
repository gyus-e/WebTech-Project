import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule, MapComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  uploadForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl(''),
    // geolocation: new FormControl('', [
    //   Validators.required,
    // ]),
    image: new FormControl('', [
      Validators.required,
      // Validators.pattern('^.*\.(jpg|jpeg|png|gif)$') // Example pattern for image files
    ])
  });


  onSubmit(): void {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      console.error('Form is invalid');
      alert('Please fill out all required fields correctly.');
      return;
    }
    console.log('Form Submitted', this.uploadForm.value);
  }
  onFileSelected(event: any): void { }
}
