import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeunderscore'
})
export class RemoveUnderScorePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const cleaned = value.replace(/_/g, ' ').toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
}
