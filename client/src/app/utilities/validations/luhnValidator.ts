import { AbstractControl, ValidatorFn } from '@angular/forms';

export function luhnValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    debugger;
    if (!control.value) return null;

    const cardNumber = control.value.replace(/\s+/g, '');
    if (!/^\d+$/.test(cardNumber)) {
      return { invalidFormat: true };
    }


    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    const isValid = sum % 10 === 0;
    return isValid ? null : { luhnCheck: { value: control.value } };
  };
}
