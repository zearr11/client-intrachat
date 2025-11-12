import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { AreaPageComponent } from './pages/area-page/area-page.component';
import { CountryPageComponent } from './pages/country-page/country-page.component';
import { HeadquartersPageComponent } from './pages/headquarters-page/headquarters-page.component';
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
        path: 'paises',
        component: CountryPageComponent
      },
      {
        path: 'sedes',
        component: HeadquartersPageComponent
      },
      {
        path: 'clientes',
        component: CustomerPageComponet
      },
      {
        path: 'areas',
        component: AreaPageComponent
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
