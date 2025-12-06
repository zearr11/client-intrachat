import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { PanelAccessService } from '../../features/auth/services/panel-access.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const panelAccessService = inject(PanelAccessService);
  const token = localStorage.getItem('token');

  if (token) {
    panelAccessService.showPanelByRole();
    return false;
  }

  return true;
};
