import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capatilize',
})
export class CapatilizePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (!value) {
      return '';
    }
    // return value.charAt(0).toUpperCase() + value.slice(1);
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20, suffix = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.slice(0, limit) + suffix : value;
  }
}

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date): string {
    const now = Date.now();
    const diff = now - new Date(value).getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return 'minute ago';
    return this.datePipe.transform(value, 'mediumDate')!;
  }

}


