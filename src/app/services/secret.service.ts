import { Injectable } from '@angular/core';
import {
  SecretListResponse,
  SecretDetailResponse,
  SecretCreateRequest,
  SecretUpdateRequest,
} from '../dto/secret.dto';
import api from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SecretService {

  async listSecrets(): Promise<SecretListResponse[]> {
    const { data } = await api.get<SecretListResponse[]>('/secrets');
    return data;
  }

  async getSecretDetail(secretId: string): Promise<SecretDetailResponse> {
    const { data } = await api.get<SecretDetailResponse>(`/secrets/${secretId}`);
    return data;
  }

  async createSecret(secret: SecretCreateRequest): Promise<SecretDetailResponse> {
    const { data } = await api.post<SecretDetailResponse>('/secrets', secret);
    return data;
  }

  async updateSecret(secretId: string, secret: SecretUpdateRequest): Promise<SecretDetailResponse> {
    const { data } = await api.patch<SecretDetailResponse>(`/secrets/${secretId}`, secret);
    return data;
  }

  async deleteSecret(secretId: string): Promise<void> {
    await api.delete(`/secrets/${secretId}`);
  }
  
}
