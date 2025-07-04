import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { Observable } from 'rxjs';
import { CatResponse } from '../../_types/cat-response.type';
import { PhotoResponse } from '../../_types/photo-response.type';

@Injectable({
  providedIn: 'root'
})
export class RestBackendUploadService {

  private readonly http = inject(HttpClient);

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };


  postCat(catName: string): Observable<CatResponse> {
    const url = REST_BACKEND_URL + '/cats';
    return this.http.post(url, { name: catName }, this.httpOptions) as Observable<CatResponse>;
  }


  postPhoto(catId: number, formValues: any): Observable<PhotoResponse> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos`;
    return this.http.post(url, formValues) as Observable<PhotoResponse>;
  }

  postComment(catId: number, photoId: number, comment: string): Observable<any> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}/comments`;
    return this.http.post(url, { text: comment }) as Observable<any>;
  }

}
