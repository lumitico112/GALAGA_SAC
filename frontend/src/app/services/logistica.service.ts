import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- Conductores ---
  getConductores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistica/conductores`, { headers: this.getHeaders() });
  }

  getConductoresDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistica/conductores/disponibles`, { headers: this.getHeaders() });
  }

  crearConductor(conductor: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logistica/conductores`, conductor, { headers: this.getHeaders() });
  }

  // --- Vehículos ---
  getVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistica/vehiculos`, { headers: this.getHeaders() });
  }

  getVehiculosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistica/vehiculos/disponibles`, { headers: this.getHeaders() });
  }

  crearVehiculo(vehiculo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logistica/vehiculos`, vehiculo, { headers: this.getHeaders() });
  }

  // --- Operadores ---
  getOperadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistica/operadores`, { headers: this.getHeaders() });
  }

  crearOperador(operador: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logistica/operadores`, operador, { headers: this.getHeaders() });
  }

  // --- Rutas ---
  getRutas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistica/rutas`, { headers: this.getHeaders() });
  }

  getRuta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logistica/rutas/${id}`, { headers: this.getHeaders() });
  }

  planificarRuta(ruta: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logistica/rutas`, ruta, { headers: this.getHeaders() });
  }

  iniciarRuta(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logistica/rutas/${id}/iniciar`, {}, { headers: this.getHeaders() });
  }

  // --- Incidencias ---
  registrarIncidencia(incidencia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/incidencias`, incidencia, { headers: this.getHeaders() });
  }

  getIncidenciasByRuta(idRuta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidencias/ruta/${idRuta}`, { headers: this.getHeaders() });
  }

  getAllIncidencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidencias`, { headers: this.getHeaders() });
  }

  // --- Entregas ---
  confirmarEntrega(entrega: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/entregas`, entrega, { headers: this.getHeaders() });
  }

  getAllEntregas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entregas`, { headers: this.getHeaders() });
  }
}
