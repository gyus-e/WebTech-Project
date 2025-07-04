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

  getPhotos(): Observable<PhotoResponse[]> {
    const url = REST_BACKEND_URL + '/photos';
    return this.http.get(url) as Observable<PhotoResponse[]>;
  }

  //TODO: define type {photoId: number, catId: number, geolocation: {lat: number, lng: number}}
  getPhotosGeolocations(): Observable<Array<any>> {
    const url = REST_BACKEND_URL + '/photos/geolocations';
    return this.http.get(url) as Observable<Array<any>>;
  }

  getCatById(catId: number): Observable<CatResponse> {
    const url = REST_BACKEND_URL + `/cats/${catId}`;
    return this.http.get(url) as Observable<CatResponse>;
  }

  getCatProfilePicture(catId: number): Observable<number | null> {
    const url = REST_BACKEND_URL + `/cats/${catId}/profile-picture`;
    return this.http.get(url) as Observable<number | null>;
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

  getComments(catId: number, photoId: number): Observable<any[]> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}/comments`;
    return this.http.get(url) as Observable<any[]>;
  }

}
