import { Component, input, output } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'icon-menu',
  imports: [],
  templateUrl: './icon-menu.component.html',
  styleUrl: './icon-menu.component.css',
})
export class IconMenuComponent {
  iconName = input.required<string>();
  description = input.required<string>();
  isActive = input<boolean>(false);
  clickIcon = output();

  private tooltipInstances: any[] = [];

  onClick() {
    this.clickIcon.emit();
  }

  ngAfterViewInit() {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    this.tooltipInstances = tooltipTriggerList.map((el) => {
      return new bootstrap.Tooltip(el);
    });
  }

  ngOnDestroy() {
    this.tooltipInstances.forEach((t) => t.dispose());
    this.tooltipInstances = [];
  }
}
