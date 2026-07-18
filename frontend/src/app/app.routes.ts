import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RutasComponent } from './components/rutas/rutas.component';
import { FlotaComponent } from './components/flota/flota.component';
import { ConductoresComponent } from './components/conductores/conductores.component';
import { IncidenciasComponent } from './components/incidencias/incidencias.component';
import { EntregaComponent } from './components/entrega/entrega.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'rutas', component: RutasComponent },
  { path: 'flota', component: FlotaComponent },
  { path: 'conductores', component: ConductoresComponent },
  { path: 'incidencias', component: IncidenciasComponent },
  { path: 'entrega', component: EntregaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
