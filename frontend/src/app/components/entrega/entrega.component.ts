import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

@Component({
  selector: 'app-entrega',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'})
export class EntregaComponent implements OnInit {
  selectedRutaId = '';
  observacion = '';

  rutasEnTransito: any[] = [];
  entregas: any[] = [];

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
this.loadRutasEnTransito();
    this.loadEntregas();
  }

  loadRutasEnTransito() {
    this.logisticaService.getRutas().subscribe({
      next: (data) => {
        this.rutasEnTransito = data.filter(r => r.estado === 'En Tránsito');
      }
    });
  }

  loadEntregas() {
    this.logisticaService.getAllEntregas().subscribe(data => this.entregas = data);
  }

  onConfirmar() {
    const payload = {
      observacion: this.observacion,
      ruta: { idRuta: Number(this.selectedRutaId) },
      estado: 'Entregado'
    };

    this.logisticaService.confirmarEntrega(payload).subscribe({
      next: () => {
        this.selectedRutaId = '';
        this.observacion = '';
        this.loadRutasEnTransito();
        this.loadEntregas();
      },
      error: (err) => {
        alert(err.error || 'Error al confirmar la entrega.');
      }
    });
  }

  
}
