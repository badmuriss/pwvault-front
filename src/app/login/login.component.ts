import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    console.log('LoginComponent inicializado.');

    try {
      if (this.authService.isLoggedIn()) {
        console.log('Usuário autenticado, redirecionando para /secrets.');
        // Redireciona para a rota de segredos
        await this.router.navigate(['/secrets']);
      } else {
        console.log('Usuário não autenticado, redirecionando para login externo.');
        // Redireciona para o login externo
        await this.authService.loginRedirect();
      }
    } catch (error) {
      console.error('Erro durante o processo de login:', error);
      // Redireciona para uma página de erro ou exibe mensagem ao usuário
      this.router.navigate(['/token-fail']);
    }
  }
}
