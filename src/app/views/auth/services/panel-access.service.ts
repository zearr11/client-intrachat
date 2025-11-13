import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../entity/user/interfaces/role-user.interface';
import { UserService } from '../../../entity/user/services/user.service';
import { RoleMapper } from '../../../entity/user/mapper/role.mapper';

@Injectable({ providedIn: 'root' })
export class PanelAccessService {

  private router = inject(Router);
  private userService = inject(UserService);

  showPanelByRole(): void {
    this.userService.loadDataCurrentUser().subscribe((isDataReady) => {

      if (!isDataReady)
        return;

      const rolesAdmin = [Role.ROLE_ADMIN, Role.ROLE_SUPERVISOR_TI, Role.ROLE_AGENTE_TI];
      const roleUserCurrent: Role = RoleMapper.rolToRolUser(
        this.userService.dataUser()!.rol
      );

      if (rolesAdmin.includes(roleUserCurrent))
        this.router.navigateByUrl('/dashboard');
      else
        this.router.navigateByUrl('/chats');
    });

  }

}
