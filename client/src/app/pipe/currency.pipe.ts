import { Pipe, PipeTransform } from '@angular/core';
import { runEffect } from 'node_modules/@angular/core/types/_effect-chunk';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currencySymbol: string = '$',
    decimalDigits: number = 2,
    useGrouping: boolean = true,
  ): string {
    if (value === null || isNaN(value)) return '';
    let formatetNumber = value.toFixed(decimalDigits);

    if (useGrouping) {
      formatetNumber = formatetNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return `${currencySymbol}${formatetNumber}`;
  }
}
