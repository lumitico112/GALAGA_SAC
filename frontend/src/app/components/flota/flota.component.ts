import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

@Component({
  selector: 'app-flota',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './flota.component.html',
  styleUrl: './flota.component.css'})
export class FlotaComponent implements OnInit {
  placa = '';
  tipo = '';
  capacidad: number | null = null;
  gps = '';

  vehiculos: any[] = [];

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
this.loadVehiculos();
  }

  loadVehiculos() {
    this.logisticaService.getVehiculos().subscribe(data => this.vehiculos = data);
  }

  onRegistrar() {
    const payload = {
      placa: this.placa,
      tipo: this.tipo,
      capacidad: this.capacidad ? Number(this.capacidad) : 0,
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

  
}
