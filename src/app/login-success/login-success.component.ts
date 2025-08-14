import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-success',
  imports: [RouterModule],
  templateUrl: './login-success.component.html',
  styleUrl: './login-success.component.css'
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.authService.handleLoginCallback();
      this.router.navigate(['/secrets']);
    } catch (error) {
      console.error('Login callback failed:', error);
      this.router.navigate(['/token-fail']);
    }
  }
}