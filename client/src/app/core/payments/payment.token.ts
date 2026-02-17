// payment.token.ts
import { InjectionToken } from '@angular/core';
import { PaymentService } from './payment-method';

export const PAYMENT_TOKEN = new InjectionToken<PaymentService>('PAYMENT_TOKEN');
