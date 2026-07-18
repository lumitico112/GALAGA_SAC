# Plan de Acción: Sistema de Gestión Logística Electoral (GALAGA S.A.C.)

Este plan describe la estrategia para diseñar e implementar el sistema propuesto en el documento `AvanceProy3_Grupo16.pdf`. El objetivo es centralizar la gestión de rutas, asignación de vehículos/conductores, monitoreo en tiempo real, registro de incidencias y confirmación de entregas para las operaciones con la ONPE.

---

## Estructura Propuesta del Proyecto

El espacio de trabajo se estructurará de la siguiente manera:
- `/` (Raíz): Archivo `docker-compose.yml` para levantar la base de datos PostgreSQL, y archivo `README.md` actualizado.
- `/backend/`: Proyecto Spring Boot 3.x con Java 21 (API REST).
- `/frontend/`: Proyecto Angular (Interfaz Administrativa y de Campo).

---

## Preguntas Abiertas

> [!IMPORTANT]
> Agradeceré tu confirmación sobre los siguientes puntos para ajustar el diseño:
> 1. **Autenticación y Roles**: ¿Deseas implementar la autenticación con JWT (JSON Web Tokens) desde la fase inicial? Los roles descritos son: Administrador, Gerente de Operaciones, Coordinador Logístico, Supervisor de Flota y Conductor.
> 2. **Simulación de GPS**: Dado que el monitoreo GPS se describe en tiempo real, ¿implementamos un simulador básico en el frontend/backend para enviar coordenadas ficticias de la flota y mostrarlas en un mapa (por ejemplo, usando Leaflet u OpenStreetMap)?
> 3. **Firmas y Fotos**: Para la confirmación de entrega (RF-17), ¿implementamos la carga de una imagen simulada o una firma digital usando un lienzo (canvas) en el frontend?

---

## Cambios Propuestos

### 1. Infraestructura y Base de Datos (Docker + PostgreSQL)

Se configurará un entorno local reproducible con Docker Compose para PostgreSQL.

#### [NEW] [docker-compose.yml](file:///c:/D/UTP%20MARZO%202026/ANALISIS%20Y%20DISE%C3%91O%20DE%20SISTEMAS/GALAGA_SAC/docker-compose.yml)
- Definición de un servicio de base de datos PostgreSQL en el puerto `5432`.
- Persistencia de datos mediante volúmenes de Docker.

#### [NEW] [schema.sql](file:///c:/D/UTP%20MARZO%202026/ANALISIS%20Y%20DISE%C3%91O%20DE%20SISTEMAS/GALAGA_SAC/backend/src/main/resources/schema.sql)
- Scripts DDL para crear las tablas definidas en el modelo físico de la página 36-38 del PDF (`usuario`, `operador`, `conductor`, `vehiculo`, `ruta`, `material_electoral`, `incidencia`, `entrega`).

---

### 2. Backend (Spring Boot 3.x + Java 21)

Se creará una API REST robusta que maneje las operaciones logísticas descritas en los paquetes de análisis (páginas 22-23).

#### [NEW] Estructura de Paquetes en `c:/D/UTP MARZO 2026/ANALISIS Y DISEÑO DE SISTEMAS/GALAGA_SAC/backend/`
- **`model/`**: Entidades JPA correspondientes a las tablas de la base de datos.
- **`repository/`**: Interfaces Spring Data JPA (`UsuarioRepository`, `VehiculoRepository`, etc.) para interactuar con PostgreSQL.
- **`service/`**: Lógica de negocio (por ejemplo, validación de disponibilidad de vehículo/conductor antes de asignar una ruta).
- **`controller/`**: Controladores REST (`UsuarioController`, `VehiculoController`, `RutaController`, `IncidenciaController`, `EntregaController`, `ReporteController`).
- **`security/`**: Configuración de Spring Security y filtros JWT (si se aprueba).

---

### 3. Frontend (Angular)

Se construirá una aplicación responsiva y dinámica que satisfaga los requisitos de visualización y control.

#### [NEW] Estructura del Frontend en `c:/D/UTP MARZO 2026/ANALISIS Y DISEÑO DE SISTEMAS/GALAGA_SAC/frontend/`
- **Componentes de Vistas**:
  - `login/`: Autenticación de usuarios.
  - `dashboard/`: Panel operativo para el Gerente de Operaciones y Supervisores con KPIs.
  - `rutas/`: Planificación, asignación y listado de rutas de distribución.
  - `flota/`: Gestión de vehículos (registro, disponibilidad, mantenimiento).
  - `conductores/`: Gestión de personal y licencias.
  - `incidencias/`: Registro y visualización de problemas en ruta en tiempo real.
  - `entrega/`: Confirmación digital con firma o fotografía (móvil y web).
- **Servicios**:
  - Servicios de conexión HTTP con el backend (HttpClient) para cada entidad.
  - Servicio de mapas para la geolocalización.

---

## Plan de Verificación

### Pruebas Automatizadas
- **Backend**: Pruebas unitarias de servicios con JUnit 5 y Mockito para validar reglas de negocio (ej. no asignar un conductor ocupado).
- Pruebas de integración del API REST usando `MockMvc`.

### Verificación Manual
1. Levantar el servicio de PostgreSQL en Docker y comprobar que las tablas se creen correctamente.
2. Probar los endpoints del backend usando un cliente HTTP integrado o cURL.
3. Levantar la aplicación de Angular localmente y verificar:
   - Flujo de inicio de sesión y redirección según rol.
   - Creación de una ruta con validación de disponibilidad.
   - Envío de incidencias y actualización en tiempo real en el dashboard del supervisor.
   - Registro de entregas.
