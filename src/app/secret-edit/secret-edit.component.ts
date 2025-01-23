import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SecretService } from '../services/secret.service';
import { SecretDetailResponse } from '../dto/secret.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-secret-edit',
  templateUrl: './secret-edit.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class SecretEditComponent implements OnInit {
  secretId!: string;
  secretDetail: SecretDetailResponse | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private secretService: SecretService
  ) {}

  
  async ngOnInit(): Promise<void> {
    this.secretId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadSecret();
  }

  async loadSecret(): Promise<void> {
    this.loading = true;
    try {
      this.secretDetail = await this.secretService.getSecretDetail(this.secretId);
    } catch (error) {
      this.errorMessage = 'Failed to load secret.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async saveSecret(): Promise<void> {
    if (!this.secretDetail || !this.secretDetail.name || !this.secretDetail.value) return;

    try {
      await this.secretService.updateSecret(this.secretId, {
        name: this.secretDetail.name,
        value: this.secretDetail.value
      });
      this.router.navigate(['/secrets', this.secretId]);
    } catch (error) {
      this.errorMessage = 'Failed to save secret.';
      console.error(error);
    }
  }

  discardChanges(): void {
    this.router.navigate(['/secrets', this.secretId]);
  }

  passwordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const inputField = document.getElementById('secretValue') as HTMLInputElement;
    inputField.type = this.passwordVisible ? 'text' : 'password';
  }

  generateSecurePassword(): void {
    if(!this.secretDetail){ return; }
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    this.secretDetail.value = password;
  }  

}
