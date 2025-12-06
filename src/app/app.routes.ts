import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'chats',
    loadChildren: () => import('./features/chat/chat.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./features/admin/admin.routes'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];
