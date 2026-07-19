
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogisticaService } from '../../services/logistica.service';
import { WebsocketService } from '../../services/websocket.service';
import { LayoutComponent } from '../layout/layout.component';

declare const L: any; // Reference to Leaflet CDN

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'})
export class DashboardComponent implements OnInit, AfterViewInit {
  totalRutas = 0;
  rutasEnTransito = 0;
  entregasConfirmadas = 0;
  incidenciasReportadas = 0;

  rutasRecientes: any[] = [];
  private map: any;

  constructor(
    private logisticaService: LogisticaService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.websocketService.connect();
    this.websocketService.rutasActualizadas.subscribe((data) => {
      this.procesarActualizacionRutas(data);
    });
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
  }

  procesarActualizacionRutas(data: any[]) {
    this.rutasRecientes = data.slice(-5).reverse(); // Get latest 5
    this.totalRutas = data.length;
    this.rutasEnTransito = data.filter(r => r.estado === 'En Tránsito').length;
    this.entregasConfirmadas = data.filter(r => r.estado === 'Entregado').length;
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
}
