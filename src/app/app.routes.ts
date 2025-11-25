import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/auth/auth.routes')
  },
  {
    path: 'chats',
    loadChildren: () => import('./views/chat/chat.routes')
  },
  {
    path: '',
    loadChildren: () => import('./views/admin/admin.routes')
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
