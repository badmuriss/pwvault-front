import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Adiciona suporte ao HttpClient
    provideRouter(routes), provideClientHydration(), // Configura o roteamento
  ],
}).catch((err) => console.error(err));
