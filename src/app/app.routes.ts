import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretsListComponent } from './secrets-list/secrets-list.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'secrets', component: SecretsListComponent, canActivate: [authGuard] }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
