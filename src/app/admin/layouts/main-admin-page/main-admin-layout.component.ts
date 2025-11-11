import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { ItemMenuComponent } from "../../components/item-menu/item-menu.component";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'main-admin-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkWithHref,
    ItemMenuComponent
  ],
  templateUrl: './main-admin-layout.component.html',
  styleUrl: './main-admin-layout.component.css'
})
export class MainAdminLayoutComponent {

  userService = inject(UserService);

  constructor() {
    this.userService.loadDataCurrentUser();
  }

}
