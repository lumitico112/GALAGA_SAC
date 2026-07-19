import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RutasComponent } from './components/rutas/rutas.component';
import { FlotaComponent } from './components/flota/flota.component';
import { ConductoresComponent } from './components/conductores/conductores.component';
import { IncidenciasComponent } from './components/incidencias/incidencias.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { MantenimientosComponent } from './components/mantenimientos/mantenimientos.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'mantenimientos',
    component: MantenimientosComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'SUPERVISOR'] }
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'COORDINADOR'] }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'contratos',
    component: ContratosComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'COORDINADOR'] }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'rutas',
    component: RutasComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'COORDINADOR'] }
  },
  {
    path: 'flota',
    component: FlotaComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'COORDINADOR', 'SUPERVISOR'] }
  },
  {
    path: 'conductores',
    component: ConductoresComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'COORDINADOR'] }
  },
  {
    path: 'incidencias',
    component: IncidenciasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'entrega',
    component: EntregaComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'COORDINADOR', 'CONDUCTOR'] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
