import { Injectable } from '@angular/core';
import {
  PublicClientApplication,
  SilentRequest,
  RedirectRequest,
} from '@azure/msal-browser';
import { environment } from '../../environments/environment';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private interactionInProgress = false;

  private msalInstance: PublicClientApplication;
  private readonly TOKEN_STORAGE_KEY = 'user_token';
  private initialized = false;

  constructor(private cryptoService: CryptoService) {
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

  async loginRedirect(): Promise<void> {
    await this.initialize();
  
    // Gerenciamento explícito de interações
    if (this.interactionInProgress) {
      console.warn('Uma interação já está em andamento. Por favor, aguarde.');
      return;
    }
  
    this.interactionInProgress = true;
  
    try {
      const loginRequest: RedirectRequest = {
        scopes: ['openid', 'profile', 'offline_access'],
      };
      await this.msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Erro durante o login:', error);
    } finally {
      this.interactionInProgress = false; // Libera o estado
    }
  }
  

  async handleRedirect(): Promise<void> {
    await this.initialize();
  
    // Evite reprocessar o redirecionamento desnecessariamente
    const account = this.msalInstance.getActiveAccount();
    if (account) {
      console.log('Usuário já autenticado:', account.username);
      return; // Redirecionamento já processado
    }
  
    if (this.interactionInProgress) {
      console.warn('Interação já em andamento.');
      return;
    }
  
    this.interactionInProgress = true;
  
    try {
      const response = await this.msalInstance.handleRedirectPromise();
  
      if (response && response.account) {
        console.log('Login bem-sucedido. Conta definida:', response.account);
        this.msalInstance.setActiveAccount(response.account);
  
        try {
          const keyVaultToken = await this.getAccessToken(['https://vault.azure.net/.default']);
          const encryptedToken = this.cryptoService.encryptWithAES(keyVaultToken);
          this.storeToken(encryptedToken);
        } catch (tokenError) {
          console.error('Erro ao obter o token do Key Vault:', tokenError);
        }
      } else {
        console.log('Nenhuma resposta de login foi encontrada no redirecionamento.');
      }
    } catch (error) {
      console.error('Erro ao processar o redirecionamento:', error);
    } finally {
      this.interactionInProgress = false;
    }
  }
  
  /**
   * Stores the JWT in localStorage.
   */
  private storeToken(jwt: string): void {
    localStorage?.setItem(this.TOKEN_STORAGE_KEY, jwt);
  }

  /**
   * Retrieves the JWT from localStorage.
   */
  getToken(): string | null {
    return localStorage?.getItem(this.TOKEN_STORAGE_KEY);
  }

  /**
   * Removes the JWT from localStorage (logout).
   */
  clearToken(): void {
    localStorage?.removeItem(this.TOKEN_STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.msalInstance.getActiveAccount();
  }
  /**
   * Logs out the user and clears session data.
   */
  logout(): void {
    this.clearToken(); // Clear JWT from localStorage
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
