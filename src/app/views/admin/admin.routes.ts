import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { CustomerPageComponet } from './pages/customer-page/customer-page.componet';
import { CampaignPageComponent } from './pages/campaign-page/campaign-page.component';
import { OperationPageComponent } from './pages/operation-page/operation-page.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { MainAdminLayoutComponent } from './layouts/main-admin-layout/main-admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: MainAdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent
      },
      {
        path: 'clientes',
        component: CustomerPageComponet
      },
      {
        path: 'campanias',
        component: CampaignPageComponent
      },
      {
        path: 'operaciones',
        component: OperationPageComponent
      },
      {
        path: 'equipos',
        component: TeamPageComponent
      },
      {
        path: 'usuarios',
        component: UserPageComponent
      },
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

export default adminRoutes;
