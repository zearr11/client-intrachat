import { Component, input } from '@angular/core';
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
  isActive = input.required<boolean>();

  ngAfterViewInit() {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
  }

}
