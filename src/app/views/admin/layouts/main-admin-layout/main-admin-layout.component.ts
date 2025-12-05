import { Component, inject, viewChild } from '@angular/core';
import {
  RouterOutlet,
  RouterLinkWithHref,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { ItemMenuComponent } from '../../common/item-menu/item-menu.component';
import { UserService } from '../../../../entity/user/services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { ManagementAccountComponent } from '../../../chat/modals/management-account/management-account.component';

@Component({
  selector: 'main-admin-layout',
  imports: [
    RouterOutlet,
    ItemMenuComponent,
    ManagementAccountComponent,
  ],
  templateUrl: './main-admin-layout.component.html',
  styleUrl: './main-admin-layout.component.css',
})
export class MainAdminLayoutComponent {
  router = inject(Router);

  userService = inject(UserService);
  authService = inject(AuthService);
  toastService = inject(ToastMessageService);

  constructor() {
    if (!this.userService.dataUser())
      this.userService.loadDataCurrentUser().subscribe();
  }

  finishSession() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.toastService.show('Sesión finalizada.', 'text-bg-secondary');
  }

  managementAccountModal =
    viewChild<ManagementAccountComponent>('accountModal');

  openModalManagementAccount() {
    this.managementAccountModal()!.show();
  }
}
