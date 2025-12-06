import { Routes } from '@angular/router';
import { MainChatLayoutComponent } from '../../core/layouts/main-chat-layout/main-chat-layout.component';

export const chatRoutes: Routes = [
  {
    path: '',
    component: MainChatLayoutComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default chatRoutes;
