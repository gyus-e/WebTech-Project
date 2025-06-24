import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';

@Injectable({
  providedIn: 'root'
})
export class RestBackendFetchService {
  private readonly http = inject(HttpClient);

  getCats() {
    const url = REST_BACKEND_URL + '/cats';
    return this.http.get(url);
  }

  getCatById(catId: number) {
    const url = REST_BACKEND_URL + `/cats/${catId}`;
    return this.http.get(url);
  }

  getCatPhotos(catId: number) {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos`;
    return this.http.get(url);
  }

  getCatPhotoById(catId: number, photoId: number) {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}`;
    return this.http.get(url);
  }

}
