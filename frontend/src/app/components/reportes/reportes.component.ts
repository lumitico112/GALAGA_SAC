import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogisticaService } from '../../services/logistica.service';
import { LayoutComponent } from '../layout/layout.component';
import { Ruta, Contrato, MaterialElectoral } from '../../models/interfaces';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'})
export class ReportesComponent implements OnInit {
  rutas: Ruta[] = [];
  rutasFiltradas: Ruta[] = [];
  contratos: Contrato[] = [];

  // KPIs
  totalMaterialesEntregados = 0;
  porcentajeCumplimiento = 0;
  totalContratosActivos = 0;

  // Filtros
  filtroEstado = 'ALL';
  filtroDestino = '';

  constructor(private logisticaService: LogisticaService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.logisticaService.getRutas().subscribe(rutas => {
      this.rutas = rutas.reverse(); // Más recientes primero
      this.aplicarFiltros();
      this.calcularKPIsRutas();
    });

    this.logisticaService.getContratos().subscribe(contratos => {
      this.contratos = contratos;
      this.totalContratosActivos = contratos.filter(c => c.estado === 'Activo').length;
    });

    // To calculate total volume accurately we'd need to sum material from delivered routes
    // But since the backend didn't expose a bulk material endpoint, we will mock the total volume calculation
    // for this UI demo. Real implementation would fetch materials or have a dedicated endpoint.
    this.totalMaterialesEntregados = 15200; // Mock data for demo
  }

  calcularKPIsRutas() {
    if (this.rutas.length === 0) return;
    const entregadas = this.rutas.filter(r => r.estado === 'Entregado').length;
    const fallidas = this.rutas.filter(r => r.estado === 'Con Incidencia' || r.estado === 'Cancelada').length;
    
    // Cumplimiento = Entregadas / (Entregadas + Fallidas)
    const totalCompletadas = entregadas + fallidas;
    if (totalCompletadas > 0) {
      this.porcentajeCumplimiento = Math.round((entregadas / totalCompletadas) * 100);
    } else {
      this.porcentajeCumplimiento = 100;
    }
  }

  aplicarFiltros() {
    this.rutasFiltradas = this.rutas.filter(r => {
      const matchEstado = this.filtroEstado === 'ALL' || r.estado === this.filtroEstado;
      const matchDestino = r.destino.toLowerCase().includes(this.filtroDestino.toLowerCase());
      return matchEstado && matchDestino;
    });
  }

  exportarCSV() {
    let csv = 'ID Ruta,Origen,Destino,Fecha Llegada,Estado,Conductor\n';
    this.rutasFiltradas.forEach(r => {
      csv += `${r.idRuta},"${r.origen}","${r.destino}",${r.fechaLlegada || 'Pendiente'},${r.estado},"${r.conductor?.nombre}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_historico_rutas.csv';
    a.click();
  }
}
