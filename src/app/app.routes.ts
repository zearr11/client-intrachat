import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/auth/auth.routes')
  },
  {
    path: 'chats',
    loadComponent: () => import('./views/chat/pages/main-chat-page/main-chat-page.component')
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
