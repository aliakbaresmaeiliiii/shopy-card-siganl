import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { PAYMENT_TOKEN } from './core/payments/payment.token';
import { PaypalService } from './core/services/paypal.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: PAYMENT_TOKEN,
      useClass: PaypalService,
    },
    provideHttpClient(),
    // importProvidersFrom(
    //   FormsModule,
    //   InMemoryWebApiModule.forRoot(AppData, { delay: 1000 }),
    // ),
    provideToastr(),
    provideRouter(routes),
  ],
};
