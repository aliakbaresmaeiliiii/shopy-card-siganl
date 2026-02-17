import { Injectable } from '@angular/core';
import { PaymentService } from '../payments/payment-method';

@Injectable({
  providedIn: 'root',
})
export class StripService implements PaymentService {
  pay() {
    console.log('Paid with strip');
  }
}
