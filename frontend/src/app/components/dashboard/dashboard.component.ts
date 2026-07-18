
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

declare const L: any; // Reference to Leaflet CDN

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <h1>Dashboard Operativo</h1>
            <p class="subtitle">Monitoreo y despacho de material electoral en tiempo real</p>
          </div>
        </header>

        <!-- KPI Cards Grid -->
        <section class="dashboard-grid">
          <div class="glass-card kpi-card">
            <div class="kpi-icon icon-blue">🗺️</div>
            <div>
              <h3>{{ totalRutas }}</h3>
              <p>Rutas Registradas</p>
            </div>
          </div>
          <div class="glass-card kpi-card">
            <div class="kpi-icon icon-yellow">🚛</div>
            <div>
              <h3>{{ rutasEnTransito }}</h3>
              <p>Rutas en Tránsito</p>
            </div>
          </div>
          <div class="glass-card kpi-card">
            <div class="kpi-icon icon-green">✓</div>
            <div>
              <h3>{{ entregasConfirmadas }}</h3>
              <p>Entregas Exitosas</p>
            </div>
          </div>
          <div class="glass-card kpi-card">
            <div class="kpi-icon icon-red">⚠️</div>
            <div>
              <h3>{{ incidenciasReportadas }}</h3>
              <p>Incidencias Activas</p>
            </div>
          </div>
        </section>

        <!-- Map & Active Routes Layout -->
        <div class="dashboard-layout">
          <!-- Live Map Section -->
          <section class="glass-panel map-section">
            <div class="section-title">
              <h2>Mapa de Seguimiento en Tiempo Real</h2>
              <span class="live-indicator"><span class="dot"></span> LIVE</span>
            </div>
            <div id="map" class="map-container"></div>
          </section>

          <!-- Recent Routes Section -->
          <section class="glass-panel routes-section">
            <div class="section-title">
              <h2>Rutas Recientes</h2>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ruta ID</th>
                    <th>Destino</th>
                    <th>Conductor</th>
                    <th>Vehículo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of rutasRecientes">
                    <td>#{{ r.idRuta }}</td>
                    <td>{{ r.destino }}</td>
                    <td>{{ r.conductor?.nombre }}</td>
                    <td>{{ r.vehiculo?.placa }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'badge-available': r.estado === 'Entregado',
                        'badge-busy': r.estado === 'En Tránsito',
                        'badge-planned': r.estado === 'Planificada'
                      }">{{ r.estado }}</span>
                    </td>
                  </tr>
                  <tr *ngIf="rutasRecientes.length === 0">
                    <td colspan="5" class="empty-msg">No hay rutas planificadas en el sistema.</td>
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

    .kpi-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .kpi-icon {
      font-size: 1.8rem;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-blue { background: rgba(37, 99, 235, 0.15); color: var(--primary); }
    .icon-yellow { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
    .icon-green { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .icon-red { background: rgba(239, 68, 68, 0.15); color: var(--danger); }

    .kpi-card h3 {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .kpi-card p {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .dashboard-layout {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .dashboard-layout {
        grid-template-columns: 1fr;
      }
    }

    .map-section, .routes-section {
      padding: 1.5rem;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .section-title h2 {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .live-indicator {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--success);
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    .map-container {
      height: 400px;
      border-radius: 8px;
      background: #13192e;
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

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userName = 'Usuario Demo';
  userRole = 'Coordinador';
  
  totalRutas = 0;
  rutasEnTransito = 0;
  entregasConfirmadas = 0;
  incidenciasReportadas = 0;

  rutasRecientes: any[] = [];
  private map: any;

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.nombre;
      this.userRole = user.rol;
    }

    this.loadDashboardData();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  loadDashboardData() {
    this.logisticaService.getRutas().subscribe({
      next: (data) => {
        this.rutasRecientes = data.slice(-5).reverse(); // Get latest 5
        this.totalRutas = data.length;
        this.rutasEnTransito = data.filter(r => r.estado === 'En Tránsito').length;
        this.entregasConfirmadas = data.filter(r => r.estado === 'Entregado').length;
      }
    });

    this.logisticaService.getAllIncidencias().subscribe({
      next: (data) => {
        this.incidenciasReportadas = data.filter(i => i.estado === 'Reportada').length;
      }
    });
  }

  initMap() {
    // Initialize map centering on Lima, Peru
    this.map = L.map('map').setView([-12.046374, -77.042793], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB'
    }).addTo(this.map);

    // Add mock tracking markers representing vehicles in transit
    const locations = [
      { coords: [-12.0463, -77.0427], name: 'Unidad 101 - Cercado de Lima' },
      { coords: [-12.1221, -77.0298], name: 'Unidad 105 - Miraflores' },
      { coords: [-11.9754, -76.9982], name: 'Unidad 112 - San Juan de Lurigancho' }
    ];

    locations.forEach(loc => {
      L.marker(loc.coords).addTo(this.map)
        .bindPopup(`<b>${loc.name}</b><br>Estado: En Tránsito`)
        .openPopup();
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
