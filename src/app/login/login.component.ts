import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    try {
      if (this.authService.isLoggedIn()) {
        this.router.navigateByUrl('/secrets'); 
      } else {
        await this.authService.loginRedirect(); 
      }
    } catch (error) {
      console.error('Error during login process:', error);
    }
  }
}
