import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { KeyVaultService } from '../services/keyvault.service';

@Component({
  selector: 'app-secrets-list',
  templateUrl: './secrets-list.component.html'
})
export class SecretsListComponent implements OnInit {
  keyvaults: any[] = [];
  secrets: any[] = [];

  constructor(private keyVaultService: KeyVaultService, private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    
  }

}
