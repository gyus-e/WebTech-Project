import { Component, effect, inject, signal } from '@angular/core';
import { CatsStateService } from '../_services/cats/cats-state.service';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { PhotoResponse } from '../_types/photo-response.type';
import { CatResponse } from '../_types/cat-response.type';
import { REST_BACKEND_URL } from '../_config/rest-backend-url';

@Component({
  selector: 'app-cats',
  imports: [],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.scss'
})
export class CatsComponent {

  catsState = inject(CatsStateService);
  fetchService = inject(RestBackendFetchService);
  catPhotosUrls = new Map<number, string>();

  constructor() {
    effect(() => {
      const cats = this.catsState.cats();
      if (!cats) {
        return;
      }
      this.initializeCatPhotosMap(cats);

    });
  }

  private initializeCatPhotosMap(cats: CatResponse[]) {
    for (const cat of cats) {
      this.fetchService.getCatPhotos(cat.id).subscribe({
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
      return;
    }
    const photoUrl = `${REST_BACKEND_URL}/cats/${cat_id}/photos/${photos[0].id}/send`
    this.catPhotosUrls.set(cat_id, photoUrl);
  }

}
