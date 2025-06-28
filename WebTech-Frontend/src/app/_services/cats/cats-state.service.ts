import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LatLng } from 'leaflet';
import { CatResponse } from '../../_types/cat-response.type';
import { RestBackendFetchService } from '../rest-backend/rest-backend-fetch.service';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { RestBackendErrorHandlerService } from '../rest-backend/rest-backend-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CatsStateService {

  cats = computed(() => this.catsSignal());
  catProfilePicUrls = new Map<number, string | undefined>();
  catGeolocations = new Map<number, LatLng | null>();
  catGeolocationsSignal = signal<Map<number, LatLng | null> | null>(null);
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
        this.getCatMetadata(cat);
      }
      this.catGeolocationsSignal.set(this.catGeolocations);
    });


    effect(() => {
      if (this.new_cat()) {
        const new_cat = this.new_cat()!;
        this.new_cat.set(null);

        this.restFetchService.getCatById(new_cat).subscribe({
          next: (cat) => {
            this.catsSignal()!.push(cat);
            this.getCatMetadata(cat);
          },
          error: (err) => {
            this.errHandler.handleError(err);
          }
        });

      }
    });

  }

  private getCatMetadata(cat: CatResponse) {
    this.restFetchService.getCatPhotoById(cat.id, cat.profilePicture).subscribe({
      next: (photo) => {
        this.catProfilePicUrls.set(cat.id, `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`);
        this.catGeolocations.set(cat.id, photo.geolocation ? new LatLng(photo.geolocation[0], photo.geolocation[1]) : null);
      },
      error: (err) => {
        this.catProfilePicUrls.set(cat.id, undefined);
        this.catGeolocations.set(cat.id, null);
      }
    });
  }

}

