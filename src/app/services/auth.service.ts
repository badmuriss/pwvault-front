import axios from 'axios'
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', 
})
export class AuthService {

  private authState: boolean = false;
  private authChecked: boolean = false;

  async loginRedirect(): Promise<void> {
    if (await this.isLoggedIn()) {
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
      try {
        // Send token to backend to set httpOnly cookie
        await axios.post(`${environment.PWVAULT_BACK_URI}/auth/set-cookie`, { token }, { withCredentials: true });
        this.authState = true;
        window.history.replaceState({}, document.title, '/');
        console.log('Token successfully set as cookie');
      } catch (error) {
        console.error('Failed to set authentication cookie:', error);
        this.authState = false;
        throw error;
      }
    }
  }
  
  private storeToken(jwt: string): void {
    // Token will be stored as httpOnly cookie by the backend
    // No longer storing in localStorage
  }

  getToken(): string | null {
    // Token is now in httpOnly cookie, not accessible from frontend
    return null;
  }

  clearToken(): void {
    // Clear cookie by calling logout endpoint
  }

  async isLoggedIn(): Promise<boolean> {
    if (!this.authChecked) {
      await this.checkAuthStatus();
    }
    return this.authState;
  }
  
  async logout(): Promise<void> {
    try {
      await axios.post(`${environment.PWVAULT_BACK_URI}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
    this.authState = false;
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      await axios.get(`${environment.PWVAULT_BACK_URI}/auth/status`, { withCredentials: true });
      this.authState = true;
      this.authChecked = true;
      return true;
    } catch (error) {
      this.authState = false;
      this.authChecked = true;
      return false;
    }
  }

  
}
