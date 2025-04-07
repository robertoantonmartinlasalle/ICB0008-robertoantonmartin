// app.routes.ts
import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Definimos las rutas principales de la aplicación
export const routes: Routes = [
  {
    path: '', // Ruta raíz
    redirectTo: 'login', // Redirige automáticamente al login
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
    path: 'player-detail/:id', // ✅ Ruta con parámetro dinámico para ID del jugador
    loadComponent: () => import('./pages/player-detail/player-detail.page').then(m => m.PlayerDetailPage)
  }
];

// Exportamos también el proveedor para usar en main.ts
export const appRouterProvider = provideRouter(routes);
