import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private secret: string;

  constructor() {
    this.secret = environment.JWT_SECRET;
    if (!this.secret) {
      throw new Error('O segredo JWT (JWT_SECRET) não foi configurado.');
    }
  }

  /**
   * Generates a signed JWT with encrypted payload
   * @param payload
   * @param expiresIn
   * @returns generated JWT.
   */
  generateSignedAndEncryptedJWT(payload: object, expiresIn: string = '1h'): string {
    const encryptedPayload = this.encryptWithAES(JSON.stringify(payload));

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiration = issuedAt + this.parseExpiration(expiresIn);

    const jwtPayload = {
      data: encryptedPayload,
      iat: issuedAt,
      exp: expiration,
    };

    const base64Header = this.base64UrlEncode(JSON.stringify(header));
    const base64Payload = this.base64UrlEncode(JSON.stringify(jwtPayload));
    const signature = CryptoJS.HmacSHA256(`${base64Header}.${base64Payload}`, this.secret).toString(CryptoJS.enc.Base64url);

    return `${base64Header}.${base64Payload}.${signature}`;
  }

  /**
   * Verifies and decrypt JWT.
   * @param token
   * @returns Original decrypted payload.
   */
  verifyAndDecryptJWT(token: string): any {
    const [headerB64, payloadB64, signature] = token.split('.');
    const dataToSign = `${headerB64}.${payloadB64}`;
    const computedSignature = CryptoJS.HmacSHA256(dataToSign, this.secret).toString(CryptoJS.enc.Base64url);

    if (computedSignature !== signature) {
      throw new Error('JWT inválido. Assinatura não corresponde.');
    }

    const payload = JSON.parse(this.base64UrlDecode(payloadB64));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      throw new Error('JWT expirado.');
    }

    const decryptedPayload = this.decryptWithAES(payload.data);
    return JSON.parse(decryptedPayload);
  }

  private encryptWithAES(text: string): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.SHA256(this.secret);
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv }).toString();
    const ivHex = CryptoJS.enc.Hex.stringify(iv);

    return `${ivHex}:${encrypted}`;
  }

  private decryptWithAES(encrypted: string): string {
    const [ivHex, encryptedPayload] = encrypted.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const key = CryptoJS.SHA256(this.secret);

    const decrypted = CryptoJS.AES.decrypt(encryptedPayload, key, { iv });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  }


  private base64UrlEncode(input: string): string {
    return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    return atob(base64);
  }

  private parseExpiration(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid expiration time. Use "s", "m", "h" or "d".');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error('Invalid time unit.');
    }
  }
}
