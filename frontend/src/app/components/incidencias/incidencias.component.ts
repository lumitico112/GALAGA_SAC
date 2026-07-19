import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.css'})
export class IncidenciasComponent implements OnInit {
  selectedRutaId = '';
  tipo = '';
  descripcion = '';

  rutasActivas: any[] = [];
  incidencias: any[] = [];

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
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

  
}
