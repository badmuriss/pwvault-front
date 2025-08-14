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
    try {
      const isAuthenticated = await this.authService.isLoggedIn();
      if (isAuthenticated) {
        await this.router.navigate(['/secrets']);
      } else {
        await this.authService.loginRedirect();
      }
    } catch (error) {
      this.router.navigate(['/token-fail']);
    }
  }
}
