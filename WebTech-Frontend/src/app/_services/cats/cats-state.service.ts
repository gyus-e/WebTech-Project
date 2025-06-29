import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
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
  new_cat = signal<number | null>(null);
  new_geo = signal<boolean>(false);

  catProfilePicUrls = new Map<number, string | undefined>();
  catGeolocations = new Map<number, LatLng | null>();

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
    });


    effect(() => {
      if (this.new_cat()) {
        const new_cat = this.new_cat()!;
        this.new_cat.set(null);

        this.restFetchService.getCatById(new_cat).subscribe({
          next: (cat) => {
            this.catsSignal()!.push(cat);
            this.catGeolocations.set(cat.id, null);
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
    this.catProfilePicUrls.set(cat.id, `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`);

    this.restFetchService.getCatPhotos(cat.id).subscribe({
      next: (photos) => {
        for (const photo of photos) {
          const geolocation = photo.geolocation?.split(',').map(Number);
          if (geolocation && geolocation.length >= 2) {
            this.catGeolocations.set(cat.id, new LatLng(geolocation[0], geolocation[1]));
            this.new_geo.set(true);
          }
        }
      },
      error: (err) => {
        this.catProfilePicUrls.set(cat.id, undefined);
      }
    });
  }

}

