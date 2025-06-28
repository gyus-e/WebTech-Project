import { Component, computed, effect, inject, signal } from '@angular/core';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CatResponse } from '../_types/cat-response.type';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';
import { CatsStateService } from '../_services/cats/cats-state.service';
import { PhotoResponse } from '../_types/photo-response.type';
import { LatLng } from 'leaflet';
import { REST_BACKEND_URL } from '../_config/rest-backend-url';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-cat-details',
  imports: [QuillModule],
  templateUrl: './cat-details.component.html',
  styleUrl: './cat-details.component.scss'
})
export class CatDetailsComponent {
  fetchService = inject(RestBackendFetchService);
  errHandler = inject(RestBackendErrorHandlerService);
  router = inject(Router);
  toastr = inject(ToastrService);
  catsState = inject(CatsStateService);

  photosUrls = new Map<number, string>();
  photos = signal<PhotoResponse[] | null>(null);
  cat_id = signal<number | undefined>(undefined);
  cat = computed(() => this.catSignal());

  private readonly catSignal = signal<CatResponse | undefined>(undefined);


  constructor(route: ActivatedRoute) {

    effect(() => {
      const catId = this.cat_id();
      if (!catId) {
        this.toastr.error('Cat ID is not set.');
        return;
      }
      this.fetchService.getCatById(catId).subscribe({
        next: (cat) => {
          if (!cat) {
            this.toastr.error('Cat not found.');
            this.router.navigateByUrl("/cats");
          } else {
            this.catSignal.set(cat);
            this.getAllPhotos(cat);
          }
        },
        error: (err) => {
          this.errHandler.handleError(err);
          this.router.navigateByUrl("/cats");
        }
      });
    });

    effect(() => {
      const photos = this.photos();
      const cat = this.cat();
      if (!photos || !cat) {
        return;
      }

      this.setPhotosUrlsAndGeolocations(cat.id, photos);
    });


    route.paramMap.subscribe(params => {
      const cat_id_param = params.get('cat_id')
      if (!cat_id_param) {
        this.toastr.error('No cat id provided in the route parameters.');
        this.router.navigateByUrl("/cats");
      };

      this.cat_id.set(Number(cat_id_param));
    });

  }


  getAllPhotos(cat: CatResponse) {
    this.fetchService.getCatPhotos(cat.id).subscribe({
      next: (photos) => {
        this.photos.set(photos);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }

  setPhotosUrlsAndGeolocations(cat_id: number, photos: PhotoResponse[]) {
    if (!photos || photos.length === 0) {
      return;
    }

    for (const photo of photos) {
      this.photosUrls.set(photo.id, `${REST_BACKEND_URL}/cats/${cat_id}/photos/${photo.id}/send`);
    }
  }

  getDescription(photo: PhotoResponse): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = photo.description ?? '';
    return txt.value;
  }


}
