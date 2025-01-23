import { Component, OnInit } from '@angular/core';
import { SecretService } from '../services/secret.service';
import {
  SecretListResponse,
  SecretCreateRequest,
} from '../dto/secret.dto';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateSecretModalComponent } from '../create-secret-modal/create-secret-modal.component';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-secrets-list',
  templateUrl: './secrets-list.component.html',
  imports: [
    CreateSecretModalComponent,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class SecretsListComponent implements OnInit {
  secrets: SecretListResponse[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  newSecret: SecretCreateRequest = {
    name: '',
    folder: '',
    value: '',
  };

  constructor(private secretService: SecretService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.loadSecrets();
  }

  async loadSecrets(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;

    try {
      this.secrets = await this.secretService.listSecrets();
    } catch (error) {
      this.errorMessage = 'Error loading secrets.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  goToSecretDetail(id: string): void {
    this.router.navigate(['/secrets', id]);
  }

  openCreateSecretModal(): void {
    const modalElement = document.querySelector('#createSecretModal');
    const modal = new Modal(modalElement as Element);
    modal.show();
  }

}
