import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="app-layout">
      <!-- Sidebar Navigation -->
      <aside class="sidebar glass-panel">
        <div class="sidebar-brand">
          <span class="logo">G</span>
          <h2>GALAGA</h2>
        </div>
        <nav class="sidebar-menu">
          <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/rutas" routerLinkActive="active" class="menu-item">
            <span class="icon">🗺️</span> Planificar Rutas
          </a>
          <a routerLink="/flota" routerLinkActive="active" class="menu-item">
            <span class="icon">🚛</span> Flota Vehicular
          </a>
          <a routerLink="/conductores" routerLinkActive="active" class="menu-item">
            <span class="icon">👥</span> Conductores
          </a>
          <a routerLink="/incidencias" routerLinkActive="active" class="menu-item">
            <span class="icon">⚠️</span> Incidencias
          </a>
          <a routerLink="/entrega" routerLinkActive="active" class="menu-item">
            <span class="icon">✓</span> Registrar Entrega
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
          <button (click)="onLogout()" class="btn-logout">Cerrar Sesión ➔</button>
        </div>
      </aside>

      <!-- Main Panel Content -->
      <main class="main-content">
        <header class="content-header">
          <div>
            <h1>Planificación de Rutas</h1>
            <p class="subtitle">Asignación de unidades y conductores para el traslado de material electoral</p>
          </div>
        </header>

        <div class="rutas-grid">
          <!-- Form to Plan Route -->
          <section class="glass-panel form-section">
            <h2>Planificar Nueva Ruta</h2>
            <form (ngSubmit)="onPlanificar()" #rutaForm="ngForm" class="route-form">
              <div class="form-group">
                <label for="origen">Origen</label>
                <input type="text" id="origen" name="origen" [(ngModel)]="origen" required placeholder="Ej. Almacén Lurín">
              </div>

              <div class="form-group">
                <label for="destino">Destino</label>
                <input type="text" id="destino" name="destino" [(ngModel)]="destino" required placeholder="Ej. ODPE Lima Centro">
              </div>

              <div class="form-group">
                <label for="conductor">Conductor (Disponible)</label>
                <select id="conductor" name="conductor" [(ngModel)]="selectedConductorId" required>
                  <option value="" disabled selected>Seleccione un conductor...</option>
                  <option *ngFor="let c of conductoresDisponibles" [value]="c.idConductor">
                    {{ c.nombre }} (Lic. {{ c.licencia }})
                  </option>
                </select>
                <p *ngIf="conductoresDisponibles.length === 0" class="warning-text">No hay conductores disponibles.</p>
              </div>

              <div class="form-group">
                <label for="vehiculo">Vehículo (Disponible)</label>
                <select id="vehiculo" name="vehiculo" [(ngModel)]="selectedVehiculoId" required>
                  <option value="" disabled selected>Seleccione un vehículo...</option>
                  <option *ngFor="let v of vehiculosDisponibles" [value]="v.idVehiculo">
                    {{ v.tipo }} - {{ v.placa }} (Cap. {{ v.capacidad }} m³)
                  </option>
                </select>
                <p *ngIf="vehiculosDisponibles.length === 0" class="warning-text">No hay vehículos disponibles.</p>
              </div>

              <div class="form-group">
                <label for="operador">Operador Responsable</label>
                <select id="operador" name="operador" [(ngModel)]="selectedOperadorId" required>
                  <option value="" disabled selected>Seleccione un operador...</option>
                  <option *ngFor="let o of operadores" [value]="o.idOperador">
                    {{ o.nombre }}
                  </option>
                </select>
              </div>

              <div *ngIf="errorMessage" class="error-alert">
                {{ errorMessage }}
              </div>
              <div *ngIf="successMessage" class="success-alert">
                {{ successMessage }}
              </div>

              <button type="submit" [disabled]="rutaForm.invalid" class="btn-primary w-full">
                Planificar y Despachar Ruta
              </button>
            </form>
          </section>

          <!-- List of Routes -->
          <section class="glass-panel list-section">
            <h2>Rutas Registradas</h2>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Conductor</th>
                    <th>Vehículo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of rutas">
                    <td>#{{ r.idRuta }}</td>
                    <td>{{ r.origen }}</td>
                    <td>{{ r.destino }}</td>
                    <td>{{ r.conductor?.nombre }}</td>
                    <td>{{ r.vehiculo?.placa }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'badge-available': r.estado === 'Entregado',
                        'badge-busy': r.estado === 'En Tránsito',
                        'badge-planned': r.estado === 'Planificada',
                        'badge-danger': r.estado === 'Con Incidencia'
                      }">{{ r.estado }}</span>
                    </td>
                    <td>
                      <button *ngIf="r.estado === 'Planificada'" (click)="onIniciarTransito(r.idRuta)" class="btn-action">
                        Iniciar Tránsito
                      </button>
                      <span *ngIf="r.estado !== 'Planificada'">-</span>
                    </td>
                  </tr>
                  <tr *ngIf="rutas.length === 0">
                    <td colspan="7" class="empty-msg">No hay rutas registradas.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-primary);
    }

    .sidebar {
      width: 260px;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      border-radius: 0;
      border-right: 1px solid var(--glass-border);
      position: fixed;
      height: 100vh;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      font-size: 1.4rem;
      font-weight: 800;
    }

    .sidebar-brand h2 {
      font-size: 1.25rem;
      letter-spacing: 1.5px;
      font-weight: 700;
    }

    .sidebar-menu {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-grow: 1;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: var(--transition-smooth);
    }

    .menu-item:hover, .menu-item.active {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      border-left: 3px solid var(--accent);
    }

    .sidebar-footer {
      border-top: 1px solid var(--glass-border);
      padding-top: 1rem;
    }

    .user-info {
      margin-bottom: 0.75rem;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .user-role {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .btn-logout {
      width: 100%;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
      padding: 0.5rem;
      font-size: 0.85rem;
      border-radius: 6px;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .main-content {
      flex-grow: 1;
      margin-left: 260px;
      padding: 2.5rem;
      overflow-y: auto;
    }

    .content-header {
      margin-bottom: 2rem;
    }

    .content-header h1 {
      font-size: 2rem;
      font-weight: 700;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }

    .rutas-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .rutas-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-section, .list-section {
      padding: 2rem;
    }

    .form-section h2, .list-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .route-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .warning-text {
      color: var(--warning);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .error-alert {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }

    .success-alert {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }

    .w-full {
      width: 100%;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th, .data-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--glass-border);
      font-size: 0.9rem;
    }

    .data-table th {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .badge-danger {
      background-color: rgba(239, 68, 68, 0.15);
      color: var(--danger);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-action {
      background: var(--primary);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .btn-action:hover {
      background: #1d4ed8;
    }

    .empty-msg {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem 0;
    }
  `]
})
export class RutasComponent implements OnInit {
  userName = 'Usuario Demo';
  userRole = 'Coordinador';

  origen = '';
  destino = '';
  selectedConductorId: any = '';
  selectedVehiculoId: any = '';
  selectedOperadorId: any = '';

  conductoresDisponibles: any[] = [];
  vehiculosDisponibles: any[] = [];
  operadores: any[] = [];
  rutas: any[] = [];

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.nombre;
      this.userRole = user.rol;
    }

    this.loadDropdownData();
    this.loadRutas();
  }

  loadDropdownData() {
    this.logisticaService.getConductoresDisponibles().subscribe(data => this.conductoresDisponibles = data);
    this.logisticaService.getVehiculosDisponibles().subscribe(data => this.vehiculosDisponibles = data);
    this.logisticaService.getOperadores().subscribe(data => this.operadores = data);
  }

  loadRutas() {
    this.logisticaService.getRutas().subscribe(data => this.rutas = data);
  }

  onPlanificar() {
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      origen: this.origen,
      destino: this.destino,
      conductor: { idConductor: Number(this.selectedConductorId) },
      vehiculo: { idVehiculo: Number(this.selectedVehiculoId) },
      operador: { idOperador: Number(this.selectedOperadorId) }
    };

    this.logisticaService.planificarRuta(payload).subscribe({
      next: (res) => {
        this.successMessage = 'Ruta planificada y despachada con éxito.';
        this.origen = '';
        this.destino = '';
        this.selectedConductorId = '';
        this.selectedVehiculoId = '';
        this.selectedOperadorId = '';
        this.loadDropdownData();
        this.loadRutas();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Error al planificar la ruta. Verifique los recursos disponibles.';
      }
    });
  }

  onIniciarTransito(idRuta: number) {
    this.logisticaService.iniciarRuta(idRuta).subscribe({
      next: () => {
        this.loadRutas();
      },
      error: (err) => {
        alert(err.error || 'Error al iniciar tránsito.');
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
