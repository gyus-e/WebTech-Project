import { Injectable } from '@angular/core';
import { REST_BACKEND_URL } from './rest-backend-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthRequest } from './auth-request.type';

@Injectable({
  providedIn: 'root'
})
export class RestBackendAuthService {
  url = REST_BACKEND_URL + '/auth';

  constructor(private http: HttpClient) {}

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
