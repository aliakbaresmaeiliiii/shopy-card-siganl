import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaypalService {
  pay() {
    console.log('Paid with Paypal');
  }
}
