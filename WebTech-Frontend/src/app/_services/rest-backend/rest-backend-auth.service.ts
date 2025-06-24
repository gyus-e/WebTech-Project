import { inject, Injectable } from '@angular/core';
import { REST_BACKEND_URL } from '../../_config/rest-backend-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthRequest } from '../../_types/auth-request.type';

@Injectable({
  providedIn: 'root'
})
export class RestBackendAuthService {
  private readonly url = REST_BACKEND_URL + '/auth';
  private readonly http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest){
    const url = this.url + '/login';
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: AuthRequest){
    const url = this.url + '/signup';
    return this.http.post<string>(url, signupRequest, this.httpOptions);
  }
}
