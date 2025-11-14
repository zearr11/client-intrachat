import { Component, input, output } from '@angular/core';

@Component({
  selector: 'actives-inactives-select-dark',
  imports: [],
  templateUrl: './actives-inactives-select-dark.component.html',
})
export class ActivesInactivesSelectDarkComponent {

  stateEmited = output<string>();
  showActives = input.required<boolean>();

}
