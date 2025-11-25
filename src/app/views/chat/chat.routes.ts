import { Routes } from '@angular/router';
import { MainChatLayoutComponent } from './layouts/main-chat-layout/main-chat-layout.component';
import { ChatCurrentPageComponent } from './pages/chat-current-page/chat-current-page.component';

export const chatRoutes: Routes = [
  {
    path: '',
    component: MainChatLayoutComponent,
    children: [
      {
        path: ':id',
        component: ChatCurrentPageComponent
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default chatRoutes;
