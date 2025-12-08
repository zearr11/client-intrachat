import { Pipe, PipeTransform } from '@angular/core';
import { FunctionsGenerics } from '../utils/functions-generics.class';

@Pipe({
  name: 'removeunderscore',
})
export class RemoveUnderScorePipe implements PipeTransform {
  transform(value: string): string {
    return FunctionsGenerics.removeUnderscoreFormat(value);
  }
}
