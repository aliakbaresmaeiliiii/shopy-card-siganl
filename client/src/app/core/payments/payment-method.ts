import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class PaymentService {
  abstract pay(): void;
}
