import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoResponse } from '../../_types/photo-response.type';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';

@Injectable({
  providedIn: 'root'
})
export class RestBackendUpdateService {

  private readonly http = inject(HttpClient);

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  putPhoto(catId: number, photoId: number, formValues: any): Observable<PhotoResponse> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}`;
    return this.http.put(url, formValues) as Observable<PhotoResponse>;
  }

  putComment(catId: number, photoId: number, commentId: number, comment: string): Observable<any> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos/${photoId}/comments/${commentId}`;
    return this.http.put(url, { text: comment }) as Observable<any>;
  }
}