import axios from 'axios'
import { environment } from '../../environments/environment.development';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', 
})
export class AuthService {

  private readonly TOKEN_STORAGE_KEY = 'user_token';

  async loginRedirect(): Promise<void> {
    if (this.isLoggedIn()) {
      return;
    }

    const { data } = await axios({
      method: "get", 
      url:`${environment.PWVAULT_BACK_URI}/authorize`});
    
    const nextLink = data.nextLink;

    window.location.href = nextLink;
  }

  async handleLoginCallback(): Promise<void> {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      this.storeToken(token);
      window.history.replaceState({}, document.title, '/');
    }
  }
  
  private storeToken(jwt: string): void {
    localStorage?.setItem(this.TOKEN_STORAGE_KEY, jwt);
  }

  getToken(): string | null {
    return localStorage?.getItem(this.TOKEN_STORAGE_KEY);
  }

  clearToken(): void {
    localStorage?.removeItem(this.TOKEN_STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  logout(): void {
    this.clearToken();
    
  }

  
}
