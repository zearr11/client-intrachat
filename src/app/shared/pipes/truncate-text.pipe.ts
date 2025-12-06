import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, limit: number = 31): string {
    if (!value) return '';

    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
