import { Component, input } from '@angular/core';

@Component({
  selector: 'chip-menu',
  imports: [],
  templateUrl: './chip-menu.component.html',
  styles: `
    .border-chip {
      border: 1px solid #adadad5e;
      border-radius: 12px;
    }
  `,
})
export class ChipMenuComponent {
  element = input.required<string>();
  isActive = input<boolean>(false);
  isLast = input<boolean>(false);
}
