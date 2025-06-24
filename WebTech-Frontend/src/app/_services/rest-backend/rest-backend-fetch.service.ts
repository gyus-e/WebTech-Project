import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { Observable } from 'rxjs';
import { CatResponse } from '../../_types/cat-response.type';
import { PhotoResponse } from '../../_types/photo-response.type';

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

  getCatPhotos(catId: number): Observable<PhotoResponse[]> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos`;
    return this.http.get(url) as Observable<PhotoResponse[]>;
  }

  getCatPhotoById(catId: number, photoId: number): Observable<PhotoResponse> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}`;
    return this.http.get(url) as Observable<PhotoResponse>;
  }

  downloadCatPhotoById(catId: number, photoId: number): Observable<Blob> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}/send`;
    return this.http.get(url, { responseType: 'blob' });
  }

}
