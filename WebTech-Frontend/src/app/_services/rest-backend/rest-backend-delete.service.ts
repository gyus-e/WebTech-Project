import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';

@Injectable({
  providedIn: 'root'
})
export class RestBackendDeleteService {

  private readonly http = inject(HttpClient);

  deleteCat(catId: number) {
    return this.http.delete(`${REST_BACKEND_URL}/cats/${catId}`);
  }

  deleteCatPhoto(catId: number, photoId: number) {
    return this.http.delete(`${REST_BACKEND_URL}/cats/${catId}/photos/${photoId}`);
  }

}
