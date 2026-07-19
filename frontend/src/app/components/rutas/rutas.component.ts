import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './rutas.component.html',
  styleUrl: './rutas.component.css'
})
export class RutasComponent implements OnInit {
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

  constructor(private logisticaService: LogisticaService) {}

  ngOnInit() {
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
}
