import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'chats',
    loadComponent: () => import('./chats/pages/main-chat-page/main-chat-page.component')
  },
  {
    path: '',
    loadChildren: () => import('./admin/admin.routes')
  },
  {
    path: '**',
    redirectTo: "login"
  }
];
