import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'item-menu',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './item-menu.component.html',
})
export class ItemMenuComponent {

  route = input.required();
  iconNameClass = input.required();
  nameItem = input.required();

}
