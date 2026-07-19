// --- Backend entity interfaces ---

export interface Usuario {
  idUsuario?: number;
  nombre: string;
  correo: string;
  contrasena?: string;
  rol: string;
}

export interface Operador {
  idOperador?: number;
  nombre: string;
  telefono: string;
}

export interface Conductor {
  idConductor?: number;
  nombre: string;
  licencia: string;
  telefono: string;
  estado: string;
}

export interface Vehiculo {
  idVehiculo?: number;
  placa: string;
  tipo: string;
  capacidad: number;
  estado: string;
  gps: string;
}

export interface Mantenimiento {
  idMantenimiento?: number;
  fecha: string;
  descripcion: string;
  costo: number;
  tipo: string;
}

export interface Ruta {
  idRuta?: number;
  origen: string;
  destino: string;
  fechaSalida?: string;
  fechaLlegada?: string;
  estado: string;
  conductor?: Conductor;
  vehiculo?: Vehiculo;
  operador?: Operador;
}

export interface Contrato {
  idContrato?: number;
  cliente: string;
  servicio: string;
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  estado: string;
}

export interface MaterialElectoral {
  idMaterial?: number;
  descripcion: string;
  cantidad: number;
  estado: string;
  ruta?: Ruta;
}

export interface Incidencia {
  idIncidencia?: number;
  fechaHora?: string;
  descripcion: string;
  tipo: string;
  estado: string;
  ruta?: Ruta;
}

export interface Entrega {
  idEntrega?: number;
  fechaEntrega?: string;
  estado: string;
  observacion: string;
  ruta?: Ruta;
}

// --- Auth DTOs ---

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  correo: string;
  nombre: string;
  rol: string;
}

// --- Error response ---

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details?: Record<string, string>;
}
