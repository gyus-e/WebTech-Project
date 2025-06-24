import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { Observable } from 'rxjs';

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


  postCat(catName: string): Observable<any> {
    const url = REST_BACKEND_URL + '/cats';
    return this.http.post(url, { name: catName }, this.httpOptions) as Observable<any>;
  }


  postPhoto(catId: number, formValues: any): Observable<any> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos`;
    return this.http.post(url, formValues) as Observable<any>;
  }


}
