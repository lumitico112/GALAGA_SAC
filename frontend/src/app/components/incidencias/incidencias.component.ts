import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

@Component({
  selector: 'app-incidencias',
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
            <h1>Registro de Incidencias</h1>
            <p class="subtitle">Reporte y seguimiento de imprevistos durante la distribución en tiempo real</p>
          </div>
        </header>

        <div class="flota-grid">
          <!-- Report Incident Form -->
          <section class="glass-panel form-section">
            <h2>Reportar Incidencia</h2>
            <form (ngSubmit)="onReportar()" #incidenciaForm="ngForm" class="route-form">
              <div class="form-group">
                <label for="ruta">Ruta Activa</label>
                <select id="ruta" name="ruta" [(ngModel)]="selectedRutaId" required>
                  <option value="" disabled selected>Seleccione la ruta...</option>
                  <option *ngFor="let r of rutasActivas" [value]="r.idRuta">
                    Ruta #{{ r.idRuta }} - {{ r.destino }} ({{ r.conductor?.nombre }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="tipo">Tipo de Incidencia</label>
                <select id="tipo" name="tipo" [(ngModel)]="tipo" required>
                  <option value="" disabled selected>Seleccione el tipo...</option>
                  <option value="Retraso">Retraso</option>
                  <option value="Falla Mecanica">Falla Mecánica</option>
                  <option value="Desvio">Desvío de Ruta</option>
                  <option value="Critico">Crítico (Accidente/Robo)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción del Suceso</label>
                <textarea id="descripcion" name="descripcion" [(ngModel)]="descripcion" required rows="4" placeholder="Describa a detalle lo sucedido en la ruta..."></textarea>
              </div>

              <button type="submit" [disabled]="incidenciaForm.invalid" class="btn-primary w-full">
                Enviar Reporte
              </button>
            </form>
          </section>

          <!-- Incident List -->
          <section class="glass-panel list-section">
            <h2>Incidencias Reportadas</h2>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Fecha/Hora</th>
                    <th>Ruta ID</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let i of incidencias">
                    <td>{{ i.fechaHora | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>#{{ i.ruta?.idRuta }}</td>
                    <td>
                      <span class="badge-type" [ngClass]="{
                        'text-danger': i.tipo === 'Critico',
                        'text-warning': i.tipo === 'Falla Mecanica' || i.tipo === 'Retraso',
                        'text-blue': i.tipo === 'Desvio'
                      }">{{ i.tipo }}</span>
                    </td>
                    <td>{{ i.descripcion }}</td>
                    <td>
                      <span class="badge badge-planned">{{ i.estado }}</span>
                    </td>
                  </tr>
                  <tr *ngIf="incidencias.length === 0">
                    <td colspan="5" class="empty-msg">No se han registrado incidencias.</td>
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

    .text-danger { color: var(--danger); font-weight: 600; }
    .text-warning { color: var(--warning); font-weight: 600; }
    .text-blue { color: var(--accent); font-weight: 600; }

    .empty-msg {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem 0;
    }
  `]
})
export class IncidenciasComponent implements OnInit {
  userName = 'Usuario Demo';
  userRole = 'Coordinador';

  selectedRutaId = '';
  tipo = '';
  descripcion = '';

  rutasActivas: any[] = [];
  incidencias: any[] = [];

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.nombre;
      this.userRole = user.rol;
    }

    this.loadRutasActivas();
    this.loadIncidencias();
  }

  loadRutasActivas() {
    this.logisticaService.getRutas().subscribe({
      next: (data) => {
        // filter routes in transit
        this.rutasActivas = data.filter(r => r.estado === 'En Tránsito' || r.estado === 'Planificada');
      }
    });
  }

  loadIncidencias() {
    this.logisticaService.getAllIncidencias().subscribe(data => this.incidencias = data);
  }

  onReportar() {
    const payload = {
      tipo: this.tipo,
      descripcion: this.descripcion,
      ruta: { idRuta: Number(this.selectedRutaId) },
      estado: 'Reportada'
    };

    this.logisticaService.registrarIncidencia(payload).subscribe({
      next: () => {
        this.selectedRutaId = '';
        this.tipo = '';
        this.descripcion = '';
        this.loadRutasActivas();
        this.loadIncidencias();
      },
      error: (err) => {
        alert(err.error || 'Error al reportar la incidencia.');
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
