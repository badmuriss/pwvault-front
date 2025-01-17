import { Injectable } from '@angular/core';
import {
  PublicClientApplication,
  SilentRequest,
  RedirectRequest,
} from '@azure/msal-browser';
import { environment } from '../../environments/environment';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private interactionInProgress = false;

  private msalInstance: PublicClientApplication;
  private readonly JWT_STORAGE_KEY = 'user_jwt';
  private initialized = false;

  constructor(private jwtService: JwtService) {
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: environment.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${environment.TENANT_ID}`,
        redirectUri: environment.REDIRECT_URI,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
      },
    });
  }

  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.msalInstance.initialize();
      this.initialized = true;
    }
  }

  /**
   * Initiates login using redirect.
   */
  async loginRedirect(): Promise<void> {
    await this.initialize(); 

    if (this.interactionInProgress) {
      console.warn('An interaction is already in progress.');
      return;
    }

    this.interactionInProgress = true;

    try {
      const loginRequest: RedirectRequest = {
        scopes: ['openid', 'profile', 'offline_access'],
      };
      await this.msalInstance?.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      this.interactionInProgress = false;
    }
  }

  /**
   * Handles the redirect response from Azure AD.
   */
  async handleRedirect(): Promise<void> {
    await this.initialize();

    const account = this.msalInstance.getActiveAccount();
    if (account) {
      return;
    }

    const response = await this.msalInstance.handleRedirectPromise();

    if (response && response.account) {
      this.msalInstance.setActiveAccount(response.account);

      try {
        // Obtain tokens for additional APIs
        const keyVaultToken = await this.getAccessToken(['https://vault.azure.net/.default']);
        const managementToken = await this.getAccessToken(['https://management.azure.com/.default']);

        const jwtPayload = {
          keyVaultToken,
          managementToken,
          accountId: response.account.homeAccountId,
        };
        const jwt = this.jwtService.generateSignedAndEncryptedJWT(jwtPayload);

        this.storeJWT(jwt);
      } catch (error) {
        console.error('Error while obtaining tokens for APIs:', error);
      }
    } else {
    }
  }

  /**
   * Stores the JWT in localStorage.
   */
  private storeJWT(jwt: string): void {
    localStorage?.setItem(this.JWT_STORAGE_KEY, jwt);
  }

  /**
   * Retrieves the JWT from localStorage.
   */
  getJWT(): string | null {
    return localStorage?.getItem(this.JWT_STORAGE_KEY);
  }

  /**
   * Removes the JWT from localStorage (logout).
   */
  clearJWT(): void {
    localStorage?.removeItem(this.JWT_STORAGE_KEY);
  }

  /**
   * Checks if the user is logged in.
   */
  isLoggedIn(): boolean {
    return !!this.getJWT();
  }

  /**
   * Logs out the user and clears session data.
   */
  logout(): void {
    this.clearJWT(); // Clear JWT from localStorage
    this.msalInstance.logoutRedirect({
      postLogoutRedirectUri: environment.REDIRECT_URI,
    });
  }

  /**
   * Obtains an access token silently for the specified scopes.
   */
  async getAccessToken(scopes: string[]): Promise<string> {
    const account = this.msalInstance.getActiveAccount();
    if (!account) {
      throw new Error('No active account! Login required.');
    }
  
    const silentRequest: SilentRequest = {
      account,
      scopes,
    };
  
    try {
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      console.error('Error while acquiring token silently:', error);
      throw error;
    }
  }
}
