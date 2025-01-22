import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true, // Define que este é um componente standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule], // Importa o RouterModule diretamente
})
export class AppComponent {
  title = 'test';

  constructor(private authService: AuthService, private router: Router) {}

  // async ngAfterViewInit() {
  //   console.log('AppComponent inicializado.');
  //   try {
  //     if (this.authService.isLoggedIn()) {
  //       console.log('Usuário autenticado. Redirecionando para /secrets.');
  //       await this.router.navigate(['/secrets']);
  //     } else {
  //       console.log('Usuário não autenticado. Redirecionando para /login.');
  //       await this.router.navigate(['login']);
  //     }
  //   } catch (error) {
  //     console.error('Erro durante a inicialização do aplicativo:', error);
  //   }
  // }
}
