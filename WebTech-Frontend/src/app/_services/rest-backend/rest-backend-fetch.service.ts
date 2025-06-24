import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { Observable } from 'rxjs';
import { CatResponse } from '../../_types/cat-response.type';

@Injectable({
  providedIn: 'root'
})
export class RestBackendFetchService {
  private readonly http = inject(HttpClient);

  getCats(): Observable<CatResponse[]> {
    const url = REST_BACKEND_URL + '/cats';
    return this.http.get(url) as Observable<CatResponse[]>;
  }

  getCatById(catId: number): Observable<CatResponse> {
    const url = REST_BACKEND_URL + `/cats/${catId}`;
    return this.http.get(url) as Observable<CatResponse>;
  }

  //TODO: Refactor to use a Photo type instead of Object

  getCatPhotos(catId: number): Observable<Object[]> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos`;
    return this.http.get(url) as Observable<Object[]>;
  }

  getCatPhotoById(catId: number, photoId: number): Observable<Object> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}`;
    return this.http.get(url);
  }

}
