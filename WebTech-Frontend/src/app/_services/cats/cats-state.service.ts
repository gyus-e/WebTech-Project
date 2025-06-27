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
  catPhotosUrls = signal<Map<number, Array<string>> | null>(null);
  catPhotosGeolocations = signal<Map<number, Array<LatLng | null>> | null>(null);


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

  }


  private getCatsDataFromPhotos(cat: CatResponse) {
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
    let photosUrlsMap = new Map<number, Array<string>>();
    let photosGeolocationsMap = new Map<number, Array<LatLng | null>>();

    if (!photos || photos.length === 0) {

      photosUrlsMap.set(cat_id, ['assets/yamamaya.jpg']);
      photosGeolocationsMap.set(cat_id, [null]);

    } else {

      for (const photo of photos) {
        const photosUrls = new Array<string>();
        const photosGeolocations = new Array<LatLng | null>();

        photosUrls.push(`${REST_BACKEND_URL}/cats/${cat_id}/photos/${photo.id}/send`);
        photosGeolocations.push(photo.geolocation ? new LatLng(photo.geolocation[0], photo.geolocation[1]) : null);

        photosUrlsMap.set(cat_id, photosUrls);
        photosGeolocationsMap.set(cat_id, photosGeolocations);
      }

    }

    this.catPhotosUrls.set(photosUrlsMap);
    this.catPhotosGeolocations.set(photosGeolocationsMap);
  }


}
