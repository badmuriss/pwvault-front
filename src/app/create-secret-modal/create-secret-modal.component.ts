import { Component, EventEmitter, Output } from '@angular/core';
import { SecretCreateRequest, SecretListResponse } from '../dto/secret.dto';
import { SecretService } from '../services/secret.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-create-secret-modal',
  templateUrl: './create-secret-modal.component.html',
  imports: [
      CommonModule,
      FormsModule,
      RouterModule,
  ],
})
export class CreateSecretModalComponent {
  @Output() onSecretCreated = new EventEmitter<SecretListResponse>();

  newSecret: SecretCreateRequest = { name: '', value: '', folder: '' };

  constructor(private secretService: SecretService) {}

  async createSecret(form: any): Promise<void> {
    if (form.valid) {
      try {
        const createdSecret = await this.secretService.createSecret(this.newSecret);
        this.onSecretCreated.emit(createdSecret);

        const modalElement = document.querySelector('#createSecretModal');
        const modal = new Modal(modalElement as Element);
        modal?.hide();

        this.newSecret = { name: '', value: '', folder: '' };
      } catch (error) {
        console.error('Error creating secret:', error);
      }
    }
  }

  passwordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const inputField = document.getElementById('secretValue') as HTMLInputElement;
    inputField.type = this.passwordVisible ? 'text' : 'password';
  }

  generateSecurePassword(): void {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    this.newSecret.value = password;
  }  
}
