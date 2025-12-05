import { Component, input, output } from '@angular/core';

export interface EntitySimpleGeneric {
  id: number;
  element: string;
}

@Component({
  selector: 'filter-select',
  imports: [],
  templateUrl: './filter-select.component.html',
})
export class FilterSelectComponent {
  dataToShow = input.required<EntitySimpleGeneric[]>();
  selectedValue = input<number | string | null>(null);
  changeEmit = output<any>();
}
