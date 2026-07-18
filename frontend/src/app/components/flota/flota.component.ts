import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

@Component({
  selector: 'app-flota',
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
            <h1>Flota Vehicular</h1>
            <p class="subtitle">Administración y control de disponibilidad de unidades de transporte</p>
          </div>
        </header>

        <div class="flota-grid">
          <!-- Register Vehicle Form -->
          <section class="glass-panel form-section">
            <h2>Registrar Unidad</h2>
            <form (ngSubmit)="onRegistrar()" #vehiculoForm="ngForm" class="route-form">
              <div class="form-group">
                <label for="placa">Placa</label>
                <input type="text" id="placa" name="placa" [(ngModel)]="placa" required placeholder="Ej. ABC-123" pattern="^[A-Z0-9]{3}-[A-Z0-9]{3,4}$" #placaInput="ngModel">
                <div *ngIf="placaInput.invalid && (placaInput.dirty || placaInput.touched)" class="warning-text">
                  Formato de placa inválido (ej. ABC-123).
                </div>
              </div>

              <div class="form-group">
                <label for="tipo">Tipo de Unidad</label>
                <input type="text" id="tipo" name="tipo" [(ngModel)]="tipo" required placeholder="Ej. Furgón Cerrado 10m³">
              </div>

              <div class="form-group">
                <label for="capacidad">Capacidad (m³)</label>
                <input type="number" id="capacidad" name="capacidad" [(ngModel)]="capacidad" required min="1" placeholder="Ej. 15.5">
              </div>

              <div class="form-group">
                <label for="gps">ID Dispositivo GPS</label>
                <input type="text" id="gps" name="gps" [(ngModel)]="gps" placeholder="Ej. GPS-UNIT-109">
              </div>

              <button type="submit" [disabled]="vehiculoForm.invalid" class="btn-primary w-full">
                Registrar Vehículo
              </button>
            </form>
          </section>

          <!-- Vehicle List -->
          <section class="glass-panel list-section">
            <h2>Unidades de la Flota</h2>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Tipo</th>
                    <th>Capacidad</th>
                    <th>GPS ID</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let v of vehiculos">
                    <td><strong>{{ v.placa }}</strong></td>
                    <td>{{ v.tipo }}</td>
                    <td>{{ v.capacidad }} m³</td>
                    <td>{{ v.gps || 'Ninguno' }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'badge-available': v.estado === 'Disponible',
                        'badge-busy': v.estado === 'Ocupado'
                      }">{{ v.estado }}</span>
                    </td>
                  </tr>
                  <tr *ngIf="vehiculos.length === 0">
                    <td colspan="5" class="empty-msg">No hay vehículos registrados.</td>
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

    .flota-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .flota-grid {
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

    .empty-msg {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem 0;
    }
  `]
})
export class FlotaComponent implements OnInit {
  userName = 'Usuario Demo';
  userRole = 'Coordinador';

  placa = '';
  tipo = '';
  capacidad: number | null = null;
  gps = '';

  vehiculos: any[] = [];

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.nombre;
      this.userRole = user.rol;
    }

    this.loadVehiculos();
  }

  loadVehiculos() {
    this.logisticaService.getVehiculos().subscribe(data => this.vehiculos = data);
  }

  onRegistrar() {
    const payload = {
      placa: this.placa,
      tipo: this.tipo,
      capacidad: this.capacidad,
      gps: this.gps,
      estado: 'Disponible'
    };

    this.logisticaService.crearVehiculo(payload).subscribe({
      next: () => {
        this.placa = '';
        this.tipo = '';
        this.capacidad = null;
        this.gps = '';
        this.loadVehiculos();
      },
      error: (err) => {
        alert(err.error || 'Error al registrar vehículo.');
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
