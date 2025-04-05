import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'player-list',
    loadComponent: () => import('./pages/player-list/player-list.page').then(m => m.PlayerListPage)
  },
  {
    path: 'player-detail',
    loadComponent: () => import('./pages/player-detail/player-detail.page').then(m => m.PlayerDetailPage)
  }
];
