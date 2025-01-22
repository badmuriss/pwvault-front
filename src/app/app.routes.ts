import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretsListComponent } from './secrets-list/secrets-list.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { TokenFailComponent } from './token-fail/token-fail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login-success', component: LoginSuccessComponent },
  { path: 'token-fail', component: TokenFailComponent },
  { path: 'secrets', component: SecretsListComponent, canActivate: [authGuard] }, 
];

console.log("essap orra aq")

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true, // Habilita o rastreamento do roteador
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
