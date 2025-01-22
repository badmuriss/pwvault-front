import { Component, OnInit } from '@angular/core';
import { SecretService } from '../services/secret.service';
import {
  SecretListResponse,
  SecretCreateRequest,
  SecretUpdateRequest,
} from '../dto/secret.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secrets-list',
  templateUrl: './secrets-list.component.html',
  imports: [CommonModule]
})
export class SecretsListComponent implements OnInit {
  secrets: SecretListResponse[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private secretService: SecretService) {}

  async ngOnInit(): Promise<void> {
    console.log(this.secrets)
    this.loadSecrets();
  }

  async loadSecrets(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;

    try {
      this.secrets = await this.secretService.listSecrets();
    } catch (error) {
      this.errorMessage = 'Erro ao carregar segredos.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async createSecret(): Promise<void> {
    const newSecret: SecretCreateRequest = {
      name: 'Novo Segredo',
      folder: 'Pasta Padrão',
      value: 'Valor do Segredo',
    };

    try {
      const createdSecret = await this.secretService.createSecret(newSecret);
      this.secrets.push(createdSecret); // Adiciona o novo segredo à lista
    } catch (error) {
      this.errorMessage = 'Erro ao criar segredo.';
      console.error(error);
    }
  }

  async updateSecret(secretId: string): Promise<void> {
    const updatedSecret: SecretUpdateRequest = {
      name: 'Segredo Atualizado',
      value: 'Novo Valor',
    };

    try {
      const secret = await this.secretService.updateSecret(secretId, updatedSecret);

      const index = this.secrets.findIndex((s) => s.id === secretId);
      if (index !== -1) {
        this.secrets[index] = secret;
      }
    } catch (error) {
      this.errorMessage = 'Erro ao atualizar segredo.';
      console.error(error);
    }
  }

  // Método para excluir um segredo
  async deleteSecret(secretId: string): Promise<void> {
    try {
      await this.secretService.deleteSecret(secretId);

      // Remove o segredo da lista
      this.secrets = this.secrets.filter((s) => s.id !== secretId);
    } catch (error) {
      this.errorMessage = 'Erro ao excluir segredo.';
      console.error(error);
    }
  }
}
