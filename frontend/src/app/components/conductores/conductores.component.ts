import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';

@Component({
  selector: 'app-conductores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './conductores.component.html',
  styleUrl: './conductores.component.css'})
export class ConductoresComponent implements OnInit {
  nombre = '';
  licencia = '';
  telefono = '';

  conductores: any[] = [];

  constructor(private authService: AuthService, private logisticaService: LogisticaService, private router: Router) {}

  ngOnInit() {
this.loadConductores();
  }

  loadConductores() {
    this.logisticaService.getConductores().subscribe(data => this.conductores = data);
  }

  onRegistrar() {
    const payload = {
      nombre: this.nombre,
      licencia: this.licencia,
      telefono: this.telefono,
      estado: 'Disponible'
    };

    this.logisticaService.crearConductor(payload).subscribe({
      next: () => {
        this.nombre = '';
        this.licencia = '';
        this.telefono = '';
        this.loadConductores();
      },
      error: (err) => {
        alert(err.error || 'Error al registrar conductor.');
      }
    });
  }

  
}
