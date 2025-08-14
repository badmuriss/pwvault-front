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
  secretsByFolder: { [folder: string]: SecretListResponse[] } = {};
  loading: boolean = false;
  errorMessage: string | null = null;

  openFolders: Set<string> = new Set();

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
      this.groupSecretsByFolder();
    } catch (error) {
      this.errorMessage = 'Error loading secrets.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  groupSecretsByFolder(): void {
    this.secretsByFolder = this.secrets.reduce(
      (acc, secret) => {
        const folder = secret.folder || 'Uncategorized';
        if (!acc[folder]) {
          acc[folder] = [];
        }
        acc[folder].push(secret);
        return acc;
      },
      {} as { [folder: string]: SecretListResponse[] }
    );
  }

  goToSecretDetail(id: string): void {
    this.router.navigate(['/secrets', id]);
  }

  openCreateSecretModal(): void {
    const modalElement = document.querySelector('#createSecretModal');
    const modal = new Modal(modalElement as Element);
    modal.show();
  }

  getFolders(): string[] {
    const folders = Object.keys(this.secretsByFolder);
    return folders.sort((a, b) => {
      if (a === 'Uncategorized') return 1;
      if (b === 'Uncategorized') return -1;
      return a.localeCompare(b);
    });
  }
  
  sanitizeId(folderName: string): string {
    return folderName.replace(/[^a-zA-Z0-9-_]/g, '-');
  }

  toggleFolder(folder: string): void {
    if (this.openFolders.has(folder)) {
      this.openFolders.delete(folder);
    } else {
      this.openFolders.add(folder);
    }
  }

  isFolderOpen(folder: string): boolean {
    return this.openFolders.has(folder);
  }
  
}
