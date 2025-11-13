import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../entity/user/services/user.service';
import { RoleMapper } from '../../../entity/user/mapper/role.mapper';
import { RoleComplete } from '../../../entity/user/enums/role-complete.enum';

@Injectable({ providedIn: 'root' })
export class PanelAccessService {

  private router = inject(Router);
  private userService = inject(UserService);

  showPanelByRole(): void {
    this.userService.loadDataCurrentUser().subscribe((isDataReady) => {

      if (!isDataReady)
        return;

      const rolesAdminPermited = [
        RoleComplete.ROLE_ADMIN, RoleComplete.ROLE_SUPERVISOR_TI, RoleComplete.ROLE_AGENTE_TI
      ];

      const roleUserCurrent: RoleComplete = RoleMapper.rolToRolUser(
        this.userService.dataUser()!.rol
      );

      if (rolesAdminPermited.includes(roleUserCurrent))
        this.router.navigateByUrl('/dashboard');
      else
        this.router.navigateByUrl('/chats');
    });

  }

}
