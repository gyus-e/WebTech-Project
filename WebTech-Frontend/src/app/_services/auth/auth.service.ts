import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthState } from './AuthState.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(),
    isAuthenticated: this.isUserAuthenticated(),
  });


  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);


  constructor() {
    effect(() => {
      const user = this.authState().user;
      const token = this.authState().token;

      this.updateLocalStorage("user", user);
      this.updateLocalStorage("token", token);
    });
  }


  logout() {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }


  updateLocalStorage(dataNameInLocalStorage: string, dataFromAuthState: string | null) {
    if (dataFromAuthState) {
      localStorage.setItem(dataNameInLocalStorage, dataFromAuthState);
    } else {
      localStorage.removeItem(dataNameInLocalStorage);
    }
  }


  getUser() {
    return localStorage.getItem("user");
  }


  getToken() {
    return localStorage.getItem("token");
  }


  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }


  verifyToken(token: string | null): boolean {
    if (!token) {
      return false;
    }
    try {
      const decodedToken = jwtDecode(token);
      const expiration = decodedToken.exp;
      if (expiration === undefined || Date.now() >= expiration * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  }


  async updateToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    })
  }


}
