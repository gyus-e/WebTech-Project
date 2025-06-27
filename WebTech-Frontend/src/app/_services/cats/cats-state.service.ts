import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LatLng } from 'leaflet';
import { CatResponse } from '../../_types/cat-response.type';
import { RestBackendFetchService } from '../rest-backend/rest-backend-fetch.service';
import { PhotoResponse } from '../../_types/photo-response.type';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { RestBackendErrorHandlerService } from '../rest-backend/rest-backend-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CatsStateService {

  cats = computed(() => this.catsSignal());
  catProfilePicUrls = new Map<number, string | undefined>();
  catPhotosUrls = new Map<number, Array<string>>();
  catPhotosGeolocations = new Map<number, Array<LatLng | null>>();
  new_cat = signal<number | null>(null);

  private readonly catsSignal = signal<CatResponse[] | null>(null);
  private readonly restFetchService = inject(RestBackendFetchService);
  private readonly errHandler = inject(RestBackendErrorHandlerService);


  constructor() {

    this.restFetchService.getCats().subscribe({
      next: (cats: CatResponse[]) => {
        this.catsSignal.set(cats);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });


    effect(() => {
      const cats = this.cats();
      if (!cats) {
        return;
      }
      for (const cat of cats) {
        this.getCatsDataFromPhotos(cat);
      }
    });


    effect(() => {
      if (this.new_cat()) {
        const new_cat = this.new_cat()!;
        this.new_cat.set(null);

        this.restFetchService.getCatById(new_cat).subscribe({
          next: (cat) => {
            this.catsSignal()!.push(cat);
            this.getCatsDataFromPhotos(cat);
          },
          error: (err) => {
            this.errHandler.handleError(err);
          }
        });

      }
    });

  }


  private getCatsDataFromPhotos(cat: CatResponse) {
    this.catProfilePicUrls.set(cat.id, `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`);

    this.restFetchService.getCatPhotos(cat.id).subscribe({
      next: (photos) => {
        this.setPhotosUrlsAndGeolocations(cat.id, photos);
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

    let photosUrls = new Array<string>();
    let photosGeolocations = new Array<LatLng | null>();

    for (const photo of photos) {
      photosUrls.push(`${REST_BACKEND_URL}/cats/${cat_id}/photos/${photo.id}/send`);
      photosGeolocations.push(photo.geolocation ? new LatLng(photo.geolocation[0], photo.geolocation[1]) : null);
    }

    this.catPhotosUrls.set(cat_id, photosUrls);
    this.catPhotosGeolocations.set(cat_id, photosGeolocations);
  }


}
