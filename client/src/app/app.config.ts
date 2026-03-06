import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { PageTitleStrategy } from './core/title/page-title.strategy';
import { PAYMENT_TOKEN } from './core/payments/payment.token';
import { PaypalService } from './core/services/paypal.service';

export const appConfig: ApplicationConfig = {
  providers: [
    Title,
    {
      provide: PAYMENT_TOKEN,
      useClass: PaypalService,
    },
    provideHttpClient(),
    provideToastr(),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
  ],
};
