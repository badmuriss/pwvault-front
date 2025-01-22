import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-token-fail',
  imports: [],
  templateUrl: './token-fail.component.html',
  styleUrl: './token-fail.component.css'
})
export class TokenFailComponent implements OnInit {
constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.authService.logout();
      this.router.navigate(['/login']);
  }
}