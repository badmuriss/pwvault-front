import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SecretService } from '../services/secret.service';
import { SecretDetailResponse } from '../dto/secret.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secret-detail',
  templateUrl: './secret-detail.component.html',
  styleUrls: ['./secret-detail.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SecretDetailComponent implements OnInit {
  secretId: string | null = null;
  secretDetail: SecretDetailResponse | null = null;
  secretVisible: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private secretService: SecretService
  ) {}

  ngOnInit(): void {
    this.secretId = this.route.snapshot.paramMap.get('id');
    if (this.secretId) {
      this.loadSecretDetail(this.secretId);
    } else {
      this.errorMessage = 'ID do segredo não encontrado.';
    }
  }

  async loadSecretDetail(id: string): Promise<void> {
    this.loading = true;
    this.errorMessage = null;
    try {
      this.secretDetail = await this.secretService.getSecretDetail(id);
    } catch (error) {
      this.errorMessage = 'Erro ao carregar os detalhes do segredo.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  toggleSecretVisibility(): void {
    this.secretVisible = !this.secretVisible;
  }

  goBack(): void {
    this.router.navigate(['/secrets']);
  }
}
