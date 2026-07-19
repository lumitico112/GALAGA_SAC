import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogisticaService } from '../../services/logistica.service';
import { LayoutComponent } from '../layout/layout.component';
import { Vehiculo, Mantenimiento } from '../../models/interfaces';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './mantenimientos.component.html',
  styleUrl: './mantenimientos.component.css'})
export class MantenimientosComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  mantenimientos: Mantenimiento[] = [];
  
  current = { vehiculoId: '', tipo: 'Preventivo', fecha: '', descripcion: '', costo: 0 };
  filtroVehiculo = '';
  
  errorMessage = '';
  successMessage = '';

  constructor(private logisticaService: LogisticaService) {}

  ngOnInit() {
    this.logisticaService.getVehiculos().subscribe(data => this.vehiculos = data);
  }

  loadMantenimientos(idVehiculo: string) {
    if (!idVehiculo) {
      this.mantenimientos = [];
      return;
    }
    this.logisticaService.getMantenimientosPorVehiculo(Number(idVehiculo)).subscribe(data => {
      this.mantenimientos = data;
    });
  }

  onSave() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.current.vehiculoId) {
      this.errorMessage = 'Debe seleccionar un vehículo';
      return;
    }

    const payload = {
      fecha: this.current.fecha,
      descripcion: this.current.descripcion,
      costo: this.current.costo,
      tipo: this.current.tipo
    };

    this.logisticaService.registrarMantenimiento(Number(this.current.vehiculoId), payload).subscribe({
      next: () => {
        this.successMessage = 'Mantenimiento registrado y vehículo actualizado a "En Mantenimiento".';
        if (this.filtroVehiculo === this.current.vehiculoId) {
          this.loadMantenimientos(this.filtroVehiculo);
        }
        this.current = { vehiculoId: '', tipo: 'Preventivo', fecha: '', descripcion: '', costo: 0 };
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Error al registrar mantenimiento.';
      }
    });
  }
}
