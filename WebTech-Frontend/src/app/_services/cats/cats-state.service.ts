import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CatResponse } from '../../_types/cat-response.type';
import { RestBackendFetchService } from '../rest-backend/rest-backend-fetch.service';
import { PhotoResponse } from '../../_types/photo-response.type';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';

@Injectable({
  providedIn: 'root'
})
export class CatsStateService {
  
  cats = computed(() => this.catsSignal());
  catPhotosUrls = new Map<number, string>();
  
  
  private readonly catsSignal = signal<CatResponse[] | null> (null);
  private readonly restFetchService = inject(RestBackendFetchService);


  constructor() {

    this.restFetchService.getCats().subscribe({
      next: (cats: CatResponse[]) => {
        this.catsSignal.set(cats);
      },
      error: (error) => {
        console.error('Error fetching cats:', error);
      }
    });

    effect(() => {
      const cats = this.cats();
      if (!cats) {
        return;
      }
      this.initializeCatPhotosMap(cats);
    });

  }


  private initializeCatPhotosMap(cats: CatResponse[]) {
    for (const cat of cats) {
      this.restFetchService.getCatPhotos(cat.id).subscribe({
        next: (photos) => {
          this.mapPhotoToCat(cat.id, photos);
        },
        error: (error) => {
          console.error(`Error fetching photos for cat ${cat.id}:`, error);
        }
      });
    }
  }


  mapPhotoToCat(cat_id: number, photos: PhotoResponse[]) {
    if (!photos || photos.length === 0) {
      this.catPhotosUrls.set(cat_id, 'assets/yamamaya.jpg');
      return;
    }
    const photoUrl = `${REST_BACKEND_URL}/cats/${cat_id}/photos/${photos[0].id}/send`
    this.catPhotosUrls.set(cat_id, photoUrl);
  }


}
