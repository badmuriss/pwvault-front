import { Component, OnInit } from '@angular/core';
import { SecretService } from '../services/secret.service';
import {
  SecretListResponse,
  SecretCreateRequest,
} from '../dto/secret.dto';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app.routes';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secrets-list',
  templateUrl: './secrets-list.component.html',
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
  ],
})
export class SecretsListComponent implements OnInit {
  secrets: SecretListResponse[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  // Define newSecret property
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
      this.errorMessage = 'Error when loading secrets.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  goToSecretDetail(id: string): void {
    this.router.navigate(['/secrets', id]);
  }

  // Method to handle secret creation
  async onCreateSecret(form: any): Promise<void> {
    if (!form.valid) return;

    try {
      const createdSecret = await this.secretService.createSecret(this.newSecret);
      this.secrets.push(createdSecret); // Add the new secret to the list
      form.reset(); // Reset the form
    } catch (error) {
      this.errorMessage = 'Error creating secret.';
      console.error(error);
    }
  }
}
