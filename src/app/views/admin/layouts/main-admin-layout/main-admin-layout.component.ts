import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink, RouterLinkActive } from '@angular/router';
import { ItemMenuComponent } from "../../components/item-menu/item-menu.component";
import { UserService } from '../../../../entity/user/services/user.service';

@Component({
  selector: 'main-admin-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkWithHref,
    ItemMenuComponent,
    RouterLinkActive
],
  templateUrl: './main-admin-layout.component.html',
  styleUrl: './main-admin-layout.component.css'
})
export class MainAdminLayoutComponent {

  userService = inject(UserService);

  constructor() {
    if (!this.userService.dataUser())
      this.userService.loadDataCurrentUser().subscribe();
  }

}
