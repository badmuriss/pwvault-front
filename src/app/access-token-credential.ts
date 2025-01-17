export class AccessTokenCredential {
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getToken() {
    return {
      token: this.accessToken,
      expiresOnTimestamp: Date.now() + 3600 * 1000, // 1 hora de validade
    };
  }
}