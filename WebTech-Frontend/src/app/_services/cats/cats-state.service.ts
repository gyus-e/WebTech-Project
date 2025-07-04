import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LatLng } from 'leaflet';
import { CatResponse } from '../../_types/cat-response.type';
import { RestBackendFetchService } from '../rest-backend/rest-backend-fetch.service';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { RestBackendErrorHandlerService } from '../rest-backend/rest-backend-error-handler.service';
import { PhotoResponse } from '../../_types/photo-response.type';

@Injectable({
  providedIn: 'root'
})
export class CatsStateService {

  catsResponses = new Array<CatResponse>();
  catProfilePicUrls = new Map<number, string>();
  catPhotos = new Map<number, Array<PhotoResponse>>();
  photoGeolocations = new Map<number, LatLng | undefined>();

  cats = computed(() => {
    this.catsFetchedSignal();
    this.newCatInitializedSignal();
    return this.catsResponses;
  });

  catProfilePics = computed(() => {
    this.profilePictureUrlUpdateSignal();
    return this.catProfilePicUrls;
  });

  catsFetchedSignal = signal<boolean>(false);
  newCatSignal = signal<CatResponse | undefined>(undefined);
  newCatInitializedSignal = signal<CatResponse | undefined>(undefined);
  newPhotoSignal = signal<PhotoResponse | undefined>(undefined);
  newPhotoInitializedSignal = signal<PhotoResponse | undefined>(undefined);

  private readonly profilePictureUrlUpdateSignal = signal<string | undefined>(undefined);
  private readonly catRemoveSignal = signal<number>(0);
  private readonly photoRemoveSignal = signal<number>(0);

  private readonly restFetchService = inject(RestBackendFetchService);
  private readonly errHandler = inject(RestBackendErrorHandlerService);

  private readonly PLACEHOLDER = 'assets/yamamaya.jpg';


  constructor() {
    effect(() => {
      if (!this.catsFetchedSignal()) {
        return;
      }
      for (const cat of this.catsResponses) {
        this.initializeCatData(cat);
      }
    });

    effect(() => {
      const newCatResponse = this.newCatSignal();
      if (!newCatResponse) {
        return;
      }
      this.catsResponses.push(newCatResponse);
      this.initializeCatData(newCatResponse);

      this.newCatInitializedSignal.set(newCatResponse);
    });

    effect(() => {
      const newPhotoUploaded = this.newPhotoSignal();
      if (!newPhotoUploaded) {
        return;
      }
      this.initializePhotoData(newPhotoUploaded);

      this.newPhotoInitializedSignal.set(newPhotoUploaded);
    });

    this.restFetchService.getCats().subscribe({
      next: (catsResponses: CatResponse[]) => {
        this.catsResponses = catsResponses;
        this.catsFetchedSignal.set(true);
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });
  }


  public removeCat(catId: number) {
    this.catsResponses = this.catsResponses.filter(cat => cat.id !== catId);
    this.catProfilePicUrls.delete(catId);
    for (const photo of this.catPhotos.get(catId) ?? []) {
      this.photoGeolocations.delete(photo.id);
    }
    this.catPhotos.delete(catId);
    this.catRemoveSignal.set(catId);
  }


  public removePhoto(catId: number, photoId: number) {
    if (this.catPhotos.has(catId)) {
      this.catPhotos.set(catId, this.catPhotos.get(catId)!.filter(photo => photo.id !== photoId));
    }
    this.photoGeolocations.delete(photoId);
    this.photoRemoveSignal.set(photoId);
  }


  private initializeCatData(cat: CatResponse) {
    if (cat.profilePicture) {
      this.catProfilePicUrls.set(cat.id, `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`);
    } else {
      this.catProfilePicUrls.set(cat.id, this.PLACEHOLDER);
    }

    this.catPhotos.set(cat.id, []);

    this.restFetchService.getCatPhotos(cat.id).subscribe({
      next: (photos) => {
        for (const photo of photos) {
          this.initializePhotoData(photo);
        }
      },
      error: (err) => {
        this.errHandler.handleError(err);
      }
    });

  }


  private initializePhotoData(photo: PhotoResponse) {
    if (this.catProfilePicUrls.get(photo.catId) === this.PLACEHOLDER) {
      console.log("No profile picture yet, setting it now.");
      this.catProfilePicUrls.set(photo.catId, `${REST_BACKEND_URL}/cats/${photo.catId}/photos/${photo.id}/send`);
      console.log("profile picture set to: ", this.catProfilePicUrls.get(photo.catId));

      this.profilePictureUrlUpdateSignal.set(this.catProfilePicUrls.get(photo.catId));
    }

    this.photoGeolocations.set(photo.id, undefined);
    const geolocation = photo.geolocation?.split(',').map(Number);
    if (geolocation && geolocation.length >= 2) {
      this.photoGeolocations.set(photo.id, new LatLng(geolocation[0], geolocation[1]));
    }

    this.catPhotos.get(photo.catId)!.push(photo);
  }
}
