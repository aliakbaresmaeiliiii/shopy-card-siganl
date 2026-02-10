import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppData } from './app-data';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // importProvidersFrom(
    //   FormsModule,
    //   InMemoryWebApiModule.forRoot(AppData, { delay: 1000 }),
    // ),
    provideRouter(routes),
  ],
};
