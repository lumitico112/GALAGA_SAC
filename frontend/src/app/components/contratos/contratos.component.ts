import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogisticaService } from '../../services/logistica.service';
import { LayoutComponent } from '../layout/layout.component';
import { Contrato } from '../../models/interfaces';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './contratos.component.html',
  styleUrl: './contratos.component.css'})
export class ContratosComponent implements OnInit {
  contratos: Contrato[] = [];
  currentContrato: Partial<Contrato> = {
    cliente: '', servicio: '', fechaInicio: '', fechaFin: '', monto: 0, estado: 'Activo'
  };
  
  editMode = false;
  errorMessage = '';
  successMessage = '';

  constructor(private logisticaService: LogisticaService) {}

  ngOnInit() {
    this.loadContratos();
  }

  loadContratos() {
    this.logisticaService.getContratos().subscribe(data => this.contratos = data);
  }

  onSave() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editMode && this.currentContrato.idContrato) {
      this.logisticaService.actualizarContrato(this.currentContrato.idContrato, this.currentContrato as Contrato).subscribe({
        next: () => {
          this.successMessage = 'Contrato actualizado con éxito.';
          this.resetForm();
          this.loadContratos();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.error || 'Error al actualizar contrato.';
        }
      });
    } else {
      this.logisticaService.crearContrato(this.currentContrato as Contrato).subscribe({
        next: () => {
          this.successMessage = 'Contrato registrado con éxito.';
          this.resetForm();
          this.loadContratos();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.error || 'Error al registrar contrato.';
        }
      });
    }
  }

  onEdit(c: Contrato) {
    this.editMode = true;
    this.currentContrato = { ...c };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onDelete(id: number) {
    if (confirm('¿Está seguro de eliminar este contrato?')) {
      this.logisticaService.eliminarContrato(id).subscribe({
        next: () => this.loadContratos(),
        error: (err) => alert(err.error?.message || err.error || 'Error al eliminar contrato')
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.currentContrato = { cliente: '', servicio: '', fechaInicio: '', fechaFin: '', monto: 0, estado: 'Activo' };
  }
}
