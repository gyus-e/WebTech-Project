import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { CatResponse } from '../../_types/cat-response.type';
import { Observable } from 'rxjs';
import { UploadForm } from '../../_types/upload-form.type';
import { AuthService } from '../auth/auth.service';
import { ErrResponse } from '../../_types/err-response.type';

@Injectable({
  providedIn: 'root'
})
export class RestBackendUploadService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly httpOptions_applicationjson = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.token()
    })
  };

  private readonly httpOptions_multipart_formdata = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.token()
    })
  };

  postCat(catName: string): Observable<CatResponse|ErrResponse> {
    const url = REST_BACKEND_URL + '/cats';
    return this.http.post(url, { name: catName }, this.httpOptions_applicationjson) as Observable<CatResponse>;
  }

  postPhoto(catId: number, formValues: any): Observable<any> {
    const url = REST_BACKEND_URL + `/cats/${catId}/photos`;
    return this.http.post(url, formValues, this.httpOptions_multipart_formdata) as Observable<any>;
  }

}
