import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test';

  constructor(
    private authService: AuthService, 
    private router: Router) {}

  async ngOnInit() {
    try {
      await this.authService.handleRedirect();
      if (this.authService.isLoggedIn()) {
        this.router.navigateByUrl('/secrets'); 
      } else {
        await this.authService.loginRedirect();
      }
    } catch (error) {
      console.error('Error during app initialization:', error);
    }
  }
}
