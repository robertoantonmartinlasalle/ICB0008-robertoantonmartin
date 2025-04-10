// app.routes.ts

import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Defino las rutas principales de la aplicación
export const routes: Routes = [
  {
    path: '', // Ruta raíz
    redirectTo: 'login', // Redirige automáticamente a la pantalla de login
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
    path: 'player-detail/:id', // Ruta con parámetro dinámico para acceder al detalle del jugador
    loadComponent: () => import('./pages/player-detail/player-detail.page').then(m => m.PlayerDetailPage)
  }
];

// Exporto el proveedor de rutas para usarlo en main.ts
export const appRouterProvider = provideRouter(routes);
