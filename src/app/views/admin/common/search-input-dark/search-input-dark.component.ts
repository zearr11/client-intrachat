import { Component, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'search-input',
  imports: [],
  templateUrl: './search-input-dark.component.html',
})
export class SearchInputDarkComponent {

  valueInput = signal<string>('');
  emitValue = output<string>();

  initialValue = input<string>();
  value = linkedSignal<string>(() => this.initialValue() ?? '');

}
