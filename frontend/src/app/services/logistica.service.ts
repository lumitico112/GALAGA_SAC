import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Conductor, Vehiculo, Operador, Ruta,
  MaterialElectoral, Incidencia, Entrega, Usuario, Contrato
} from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // --- Conductores ---
  getConductores(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(`${this.apiUrl}/logistica/conductores`);
  }

  getConductoresDisponibles(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(`${this.apiUrl}/logistica/conductores/disponibles`);
  }

  crearConductor(conductor: Conductor): Observable<Conductor> {
    return this.http.post<Conductor>(`${this.apiUrl}/logistica/conductores`, conductor);
  }

  actualizarConductor(id: number, conductor: Conductor): Observable<Conductor> {
    return this.http.put<Conductor>(`${this.apiUrl}/logistica/conductores/${id}`, conductor);
  }

  eliminarConductor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/logistica/conductores/${id}`);
  }

  // --- Vehículos ---
  getVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/logistica/vehiculos`);
  }

  getVehiculosDisponibles(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/logistica/vehiculos/disponibles`);
  }

  crearVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${this.apiUrl}/logistica/vehiculos`, vehiculo);
  }

  actualizarVehiculo(id: number, vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.apiUrl}/logistica/vehiculos/${id}`, vehiculo);
  }

  eliminarVehiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/logistica/vehiculos/${id}`);
  }

  // --- Mantenimientos ---
  getMantenimientosPorVehiculo(idVehiculo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistica/vehiculos/${idVehiculo}/mantenimientos`);
  }

  registrarMantenimiento(idVehiculo: number, mantenimiento: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logistica/vehiculos/${idVehiculo}/mantenimientos`, mantenimiento);
  }

  // --- Operadores ---
  getOperadores(): Observable<Operador[]> {
    return this.http.get<Operador[]>(`${this.apiUrl}/logistica/operadores`);
  }

  crearOperador(operador: Operador): Observable<Operador> {
    return this.http.post<Operador>(`${this.apiUrl}/logistica/operadores`, operador);
  }

  actualizarOperador(id: number, operador: Operador): Observable<Operador> {
    return this.http.put<Operador>(`${this.apiUrl}/logistica/operadores/${id}`, operador);
  }

  eliminarOperador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/logistica/operadores/${id}`);
  }

  // --- Rutas ---
  getRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${this.apiUrl}/logistica/rutas`);
  }

  getRuta(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.apiUrl}/logistica/rutas/${id}`);
  }

  planificarRuta(ruta: any): Observable<Ruta> {
    return this.http.post<Ruta>(`${this.apiUrl}/logistica/rutas`, ruta);
  }

  iniciarRuta(id: number): Observable<Ruta> {
    return this.http.post<Ruta>(`${this.apiUrl}/logistica/rutas/${id}/iniciar`, {});
  }

  cancelarRuta(id: number): Observable<Ruta> {
    return this.http.post<Ruta>(`${this.apiUrl}/logistica/rutas/${id}/cancelar`, {});
  }

  // --- Material Electoral ---
  crearMaterial(material: MaterialElectoral): Observable<MaterialElectoral> {
    return this.http.post<MaterialElectoral>(`${this.apiUrl}/logistica/material`, material);
  }

  getMaterialesPorRuta(idRuta: number): Observable<MaterialElectoral[]> {
    return this.http.get<MaterialElectoral[]>(`${this.apiUrl}/logistica/material/ruta/${idRuta}`);
  }

  // --- Incidencias ---
  registrarIncidencia(incidencia: any): Observable<Incidencia> {
    return this.http.post<Incidencia>(`${this.apiUrl}/incidencias`, incidencia);
  }

  getIncidenciasByRuta(idRuta: number): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/incidencias/ruta/${idRuta}`);
  }

  getAllIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/incidencias`);
  }

  // --- Entregas ---
  confirmarEntrega(entrega: any): Observable<Entrega> {
    return this.http.post<Entrega>(`${this.apiUrl}/entregas`, entrega);
  }

  getAllEntregas(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.apiUrl}/entregas`);
  }

  // --- Usuarios (Admin only) ---
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  crearUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/auth/register`, usuario);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  // --- Contratos ---
  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/contratos`);
  }

  crearContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.apiUrl}/contratos`, contrato);
  }

  actualizarContrato(id: number, contrato: Contrato): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.apiUrl}/contratos/${id}`, contrato);
  }

  eliminarContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contratos/${id}`);
  }
}
