import { Component, input, output } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'icon-menu',
  imports: [],
  templateUrl: './icon-menu.component.html',
  styleUrl: './icon-menu.component.css'
})
export class IconMenuComponent {

  iconName = input.required<string>();
  description = input.required<string>();
  isActive = input<boolean>(false);
  clickIcon = output();

  onClick() {
    this.clickIcon.emit();
  }

  ngAfterViewInit() {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
  }

}
