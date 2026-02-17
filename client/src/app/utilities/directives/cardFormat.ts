import { Directive, HostListener, ElementRef, WritableSignal } from '@angular/core';

@Directive({
  selector: '[appCardFormat]',
})
export class CardFormatDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    let digits = input.value.replace(/\D/g, ''); // remove non-digits
    digits = digits.slice(0, 16); // limit length
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    input.value = formatted;
  }
}


@Directive({
  selector: '[appCvv]'
})
export class CvvDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  signal!: WritableSignal<string>;

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = digits;
    if (this.signal) this.signal.set(digits);
  }
}



@Directive({
  selector: '[appExpiryDate]'
})
export class ExpiryDateDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  signal!: WritableSignal<string>;

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 4);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = digits.slice(0,2) + '/' + digits.slice(2);
    }
    input.value = formatted;
    if (this.signal) this.signal.set(digits);
  }
}
