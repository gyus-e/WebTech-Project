import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LatLng } from 'leaflet';
import { CatResponse } from '../../_types/cat-response.type';
import { RestBackendFetchService } from '../rest-backend/rest-backend-fetch.service';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { RestBackendErrorHandlerService } from '../rest-backend/rest-backend-error-handler.service';
import { PhotoResponse } from '../../_types/photo-response.type';
import { CatsComponent } from '../../cats/cats.component';

@Injectable({
  providedIn: 'root'
})
export class CatsStateService {

  cats = computed(() => this.catsSignal());
  new_cat = signal<CatResponse | null>(null);
  new_photo = signal<PhotoResponse | null>(null);
  new_geo = signal<boolean>(false);

  catProfilePicUrls = signal(new Map<number, string | undefined>());
  photoGeolocations = new Map<number, LatLng | null>();

  private readonly catsSignal = signal<CatResponse[] | null>(null);
  // private readonly newProfilePicUrl = signal(0);
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

    // initialize all cats data on when the cats are fetched
    effect(() => {
      const cats = this.cats();
      if (!cats) {
        return;
      }
      for (const cat of cats) {
        this.initializeCatData(cat);
      }
    });

    // fetch and initialize new cat data when one is uploaded
    effect(() => {
      if (this.new_cat()) {
        //is this part really necessary? Just use the signal
        const new_cat = this.new_cat()!;
        this.new_cat.set(null);

        this.restFetchService.getCatById(new_cat.id).subscribe({
          next: (newCat) => {
            this.catsSignal()!.push(newCat);
            this.initializeCatData(newCat);
          },
          error: (err) => {
            this.errHandler.handleError(err);
          }
        });

      }
    });

    effect(() => {
      if (this.new_photo()) {
        const new_photo = this.new_photo()!;
        this.new_photo.set(null);
        this.initializePhotoData(new_photo);
      }
    });

  }

  private initializeCatData(cat: CatResponse) {
    if (cat.profilePicture) {
      this.catProfilePicUrls().set(cat.id, `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`);
    }
    console.log(`initializeCatData - cat ${cat.id} profile pic url is: ${this.catProfilePicUrls().get(cat.id)}`);

    this.restFetchService.getCatPhotos(cat.id).subscribe({
      next: (photos) => {
        for (const photo of photos) {
          this.initializePhotoData(photo);
        }
      },
      error: (err) => {
        this.catProfilePicUrls().set(cat.id, undefined);
      }
    });
  }


  private initializePhotoData(photo: PhotoResponse) {
    const profilePicUrl = this.catProfilePicUrls().get(photo.catId);
    if (!profilePicUrl) {
      let map = new Map(this.catProfilePicUrls());
      map.set(photo.catId, `${REST_BACKEND_URL}/cats/${photo.catId}/photos/${photo.id}/send`);
      this.catProfilePicUrls.set(map);
      // this.catProfilePicUrls().set(photo.catId, `${REST_BACKEND_URL}/cats/${photo.catId}/photos/${photo.id}/send`);
      // this.newProfilePicUrl.set(this.newProfilePicUrl() + 1);
    }
    console.log(`initializePhotoData: cat ${photo.catId} profile pic url is: ${this.catProfilePicUrls().get(photo.catId)}`);

    this.photoGeolocations.set(photo.id, null);

    const geolocation = photo.geolocation?.split(',').map(Number);
    if (geolocation && geolocation.length >= 2) {
      this.photoGeolocations.set(photo.id, new LatLng(geolocation[0], geolocation[1]));
      this.new_geo.set(true);
    }
  }
}

