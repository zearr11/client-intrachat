import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard/pages/dashboard-page/dashboard-page.component';
import { MainAdminLayoutComponent } from '../../core/layouts/main-admin-layout/main-admin-layout.component';
import { CompanyPageComponent } from './company/pages/company-page/company-page.component';
import { HeadquartersPageComponent } from './headquarters/pages/headquarters-page/headquarters-page.component';
import { CampaignPageComponent } from './campaign/pages/campaign-page/campaign-page.component';
import { OperationPageComponent } from './operation/pages/operation-page/operation-page.component';
import { TeamPageComponent } from './team/pages/team-page/team-page.component';
import { UserPageComponent } from './user/pages/user-page/user-page.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: MainAdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'empresas',
        component: CompanyPageComponent,
      },
      {
        path: 'sedes',
        component: HeadquartersPageComponent,
      },
      {
        path: 'campanias',
        component: CampaignPageComponent,
      },
      {
        path: 'operaciones',
        component: OperationPageComponent,
      },
      {
        path: 'equipos',
        component: TeamPageComponent,
      },
      {
        path: 'usuarios',
        component: UserPageComponent,
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

export default adminRoutes;
