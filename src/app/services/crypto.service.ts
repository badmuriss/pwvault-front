import { Injectable } from '@angular/core';
import forge from 'node-forge';
import { environment } from '../../environments/environment';
import CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private secret: string; // Chave pública para criptografar

  constructor() {
    this.secret = environment.CRYPTO_SECRET; // Configurar a chave pública no ambiente
    if (!this.secret) {
      throw new Error('A chave pública não foi configurada.');
    }
  }

    encryptWithAES(text: string): string {
      const iv = CryptoJS.lib.WordArray.random(16);
      const key = CryptoJS.SHA256(this.secret);
      const encrypted = CryptoJS.AES.encrypt(text, key, { iv }).toString();
      const ivHex = CryptoJS.enc.Hex.stringify(iv);

      return `${ivHex}:${encrypted}`;
    }

    decryptWithAES(encrypted: string): string {
      const [ivHex, encryptedPayload] = encrypted.split(':');
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const key = CryptoJS.SHA256(this.secret);

      const decrypted = CryptoJS.AES.decrypt(encryptedPayload, key, { iv });
      return CryptoJS.enc.Utf8.stringify(decrypted);
    }

}
