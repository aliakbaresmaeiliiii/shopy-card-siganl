import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import type { ValidationResult } from '@angular/forms/signals';
import {
  form,
  FormField,
  maxLength,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';
import { PAYMENT_TOKEN } from '../core/payments/payment.token';
import { PaypalService } from '../core/services/paypal.service';
import { StripService } from '../core/services/strip.service';
import { luhnValidator } from '../utilities/validations/luhnValidator';
import { max } from 'rxjs';
import {
  CardFormatDirective,
  CvvDirective,
  ExpiryDateDirective,
} from '../utilities/directives/cardFormat';

export interface formModel {
  name: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
}

@Component({
  selector: 'pm-checkout',
  imports: [
    FormField,
    ReactiveFormsModule,
    CardFormatDirective,
    CvvDirective,
    ExpiryDateDirective,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  paymentService = inject(PAYMENT_TOKEN);
  private paypal = inject(PaypalService);
  private stripe = inject(StripService);

  checkoutModel = signal<formModel>({
    name: '',
    cardNumber: '',
    cvv: '',
    expireDate: '',
  });

  checkoutForm = form(this.checkoutModel, (checkout) => {
    required(checkout.name, { message: 'Name is required' });

    required(checkout.cardNumber, { message: 'Card number is required' });

    required(checkout.cvv, { message: 'CVV is required' });
    pattern(checkout.cvv, /^[0-9]{3,4}$/, {
      message: 'CVV must be 3 or 4 digits',
    });

    required(checkout.expireDate, { message: 'Expire date is required' });
    pattern(checkout.expireDate, /^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: 'Expire date must be in MM/YY format',
    });

    // validate(checkout.cardNumber, (field): ValidationResult => {
    //   const value = field.value();
    //   if (!value) return null;

    //   const digitsOnly = value.replace(/\s+/g, '');

    //   if (!/^\d+$/.test(digitsOnly)) {
    //     return {
    //       kind: 'invalidFormat',
    //       message: 'Card number must be digits only',
    //     };
    //   }

    //   if (digitsOnly.length < 13 || digitsOnly.length > 16) {
    //     return {
    //       kind: 'lengthInvalid',
    //       message: 'Card number must be 13–16 digits',
    //     };
    //   }

    //   // Luhn check
    //   let sum = 0;
    //   let shouldDouble = false;

    //   for (let i = digitsOnly.length - 1; i >= 0; i--) {
    //     let digit = Number(digitsOnly[i]);

    //     if (shouldDouble) {
    //       digit *= 2;
    //       if (digit > 9) digit -= 9;
    //     }

    //     sum += digit;
    //     shouldDouble = !shouldDouble;
    //   }

    //   if (sum % 10 !== 0) {
    //     return {
    //       kind: 'luhnInvalid',
    //       message: 'Card number is invalid',
    //     };
    //   }

    //   return null;
    // });
  });
  nameField = this.checkoutForm.name;
  cardNumberField = this.checkoutForm.cardNumber;

  selectMethod(type: string) {
    this.paymentService = type === 'paypal' ? this.paypal : this.stripe;
  }

  handlePayment() {
    const data = this.checkoutForm().value();
    console.log('👍👍👍', data);

    // if (this.checkoutForm().valid()) {
    //   debugger;
    //   this.paymentService.pay();
    //   console.log('Payment submitted', this.checkoutModel());
    // } else {
    //   console.warn('Form invalid', this.checkoutForm().errors());
    // }
  }
}
