import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component'),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

export default authRoutes;
