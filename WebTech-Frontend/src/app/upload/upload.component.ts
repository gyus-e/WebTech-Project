import { Component, effect, inject, signal } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RestBackendUploadService } from '../_services/rest-backend/rest-backend-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { CatsStateService } from '../_services/cats/cats-state.service';
import { QuillModule } from 'ngx-quill';
import { MapStateService } from '../_services/map/map-state.service';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule, MapComponent, QuillModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  catState = inject(CatsStateService);
  mapState = inject(MapStateService);
  errHandler = inject(RestBackendErrorHandlerService);
  uploadService = inject(RestBackendUploadService);
  fetchService = inject(RestBackendFetchService);

  multipartFormDataSignal = signal<FormData | undefined>(undefined);
  cat_id = signal<number | undefined>(undefined);
  cat_name = signal<string>('');

  uploadForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl(''),
    geolocation: new FormControl('', [
      // Validators.required,
    ]),
    photo: new FormControl(null, [
      Validators.required,
      // Validators.pattern('^.*\.(jpg|jpeg|png|gif)$')
    ])
  });


  constructor(route: ActivatedRoute) {
    //get cat_id from route parameters
    route.paramMap.subscribe(params => {
      const cat_id_param = params.get('cat_id')
      if (!cat_id_param) {
        this.toastr.error('No cat id provided in the route parameters.');
        this.router.navigateByUrl("/");
      };

      this.cat_id.set(Number(cat_id_param));
    });

    //get cat_name from backend when cat_id is set (from route parameters observable)
    effect(() => {
      if (!this.cat_id()) {
        return;
      }
      this.fetchService.getCatById(this.cat_id()!).subscribe({
        next: (response: any) => {
          this.cat_name.set(response.name);
        },

        error: (error: any) => {
          this.errHandler.handleError(error);
          this.router.navigateByUrl("/");
        }
      });
    });

    //set geolocation when user clicks on map
    effect(() => {
      const clickPosition = this.mapState.clickPositionSignal();
      if (clickPosition) {
        this.uploadForm.patchValue({ geolocation: `${clickPosition.lat},${clickPosition.lng}` });
      }
    });

    //upload photo when multipartFormDataSignal is set (on form submit)
    effect(() => {

      if (this.cat_id() && this.multipartFormDataSignal()?.has('photo')) {
        this.uploadService.postPhoto(this.cat_id()!, this.multipartFormDataSignal()!).subscribe({

          next: (response: any) => {
            this.toastr.success('Photo uploaded successfully!');
            console.log(response);
            this.uploadForm.reset();
            this.catState.new_cat.set(this.cat_id()!);
            setTimeout(() => { this.router.navigateByUrl("/") }, 10);
          },

          error: (error: any) => {
            this.errHandler.handleError(error);
            console.log(error);
          }

        });
      }

    });
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.patchValue({ photo: file });
      this.uploadForm.get('photo')?.updateValueAndValidity();
    }
  }


  onSubmit(): void {
    if (this.uploadForm.invalid) {
      console.error('Form is invalid');
      this.toastr.error('Please fill out all required fields correctly.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.uploadForm.value.title!);
    formData.append('description', this.uploadForm.value.description ?? '');
    formData.append('geolocation', this.uploadForm.value.geolocation ?? '');
    formData.append('photo', this.uploadForm.value.photo!);

    console.log('Form Data:', formData);

    this.multipartFormDataSignal.set(formData);
  }
}
