import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class KeyVaultService {

  constructor(private authService: AuthService) {}

  async listKeyVaults(): Promise<any[]> {
   return [null];
  }

  async listSecrets(vaultName: string): Promise<any[]> {
    return [null];
  }

  async getSecretValue(vaultName: string, secretName: string): Promise<string | undefined> {
    return undefined;
  }
}
