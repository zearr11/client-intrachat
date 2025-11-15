import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../entity/user/services/user.service';
import { Role } from '../../../entity/user/enums/role-user.enum';
import { ToastMessageService } from '../../../shared/services/toast-message.service';

@Injectable({ providedIn: 'root' })
export class PanelAccessService {

  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(ToastMessageService);

  showPanelByRole(): void {
    this.userService.loadDataCurrentUser().subscribe((isDataReady) => {
      if (!isDataReady)
        return;

      this.toastService.show(
        `Bienvenido ${this.userService.getNameAccount()}`, 'text-bg-success'
      );

      const roleUserCurrent: Role = this.userService.dataUser()!.rol;

      if (roleUserCurrent == Role.ADMIN)
        this.router.navigateByUrl('/dashboard');
      else
        this.router.navigateByUrl('/chats');
    });
  }

}
