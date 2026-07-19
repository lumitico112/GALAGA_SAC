import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogisticaService } from '../../services/logistica.service';
import { LayoutComponent } from '../layout/layout.component';
import { Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  currentUsuario: Partial<Usuario> & { contrasena?: string } = {
    nombre: '', correo: '', rol: '', contrasena: ''
  };
  
  editMode = false;
  errorMessage = '';
  successMessage = '';

  constructor(private logisticaService: LogisticaService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.logisticaService.getUsuarios().subscribe(data => this.usuarios = data);
  }

  onSave() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editMode && this.currentUsuario.idUsuario) {
      this.logisticaService.actualizarUsuario(this.currentUsuario.idUsuario, this.currentUsuario as Usuario).subscribe({
        next: () => {
          this.successMessage = 'Usuario actualizado con éxito.';
          this.resetForm();
          this.loadUsuarios();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.error || 'Error al actualizar usuario.';
        }
      });
    } else {
      this.logisticaService.crearUsuario(this.currentUsuario).subscribe({
        next: () => {
          this.successMessage = 'Usuario registrado con éxito.';
          this.resetForm();
          this.loadUsuarios();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.error || 'Error al registrar usuario.';
        }
      });
    }
  }

  onEdit(u: Usuario) {
    this.editMode = true;
    this.currentUsuario = { ...u, contrasena: '' };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onDelete(id: number) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.logisticaService.eliminarUsuario(id).subscribe({
        next: () => this.loadUsuarios(),
        error: (err) => alert(err.error?.message || err.error || 'Error al eliminar usuario')
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.currentUsuario = { nombre: '', correo: '', rol: '', contrasena: '' };
  }
}
