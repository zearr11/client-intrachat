import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { MainChatPageComponent } from './chats/pages/main-chat-page/main-chat-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    component: MainChatPageComponent
  },
  {
    path: '**',
    redirectTo: "login"
  }
];
