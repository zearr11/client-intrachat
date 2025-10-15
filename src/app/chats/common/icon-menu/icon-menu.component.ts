import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-menu',
  imports: [],
  templateUrl: './icon-menu.component.html',
  styleUrl: './icon-menu.component.css'
})
export class IconMenuComponent {

  iconName = input.required<string>();

}
