# GALAGA_SAC

# Guía de Instalación y Ejecución - GALAGA S.A.C.

Esta guía detalla los pasos necesarios para que cualquier integrante del equipo pueda descargar y poner en funcionamiento el proyecto localmente (tanto el backend como el frontend).

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

1. **Java JDK 17** (o superior).
2. **Apache Maven** (para gestionar y compilar el backend).
3. **Node.js** (versión 18 o superior recomendado) y npm.
4. **Docker Desktop** (opción recomendada para la base de datos) **O** una instalación local nativa de **PostgreSQL 15+**.

---

## 🚀 Pasos para Iniciar el Proyecto

### Paso 1: Configurar la Base de Datos (PostgreSQL)

Tienes dos alternativas para levantar la base de datos en el puerto `5432`:

#### Opción A: Usando Docker (Recomendado y más rápido)

1. Abre la aplicación **Docker Desktop** y asegúrate de que el servicio esté corriendo (icono en verde).
2. Abre una terminal en la **raíz del proyecto** (donde se encuentra el archivo `docker-compose.yml`) y ejecuta:
   ```bash
   docker compose up -d
   ```
   _Esto descargará la imagen oficial de Postgres y creará de manera automática la base de datos `galaga_db` con el usuario `galaga_user` y contraseña `galaga_password`._

#### Opción B: Usando PostgreSQL Local (Instalación nativa de Windows/Linux)

1. Si tienes PostgreSQL instalado localmente, asegúrate de que el puerto `5432` no esté bloqueado.
2. Abre tu cliente de base de datos (como **pgAdmin** o **DBeaver**) y crea lo siguiente manualmente:
   - **Base de datos:** `galaga_db`
   - **Usuario:** `galaga_user`
   - **Contraseña:** `galaga_password`
   - _Asegúrate de otorgar al usuario todos los permisos sobre la base de datos._

---

### Paso 2: Ejecutar el Backend (Spring Boot)

1. Abre una terminal y navega hasta la carpeta del backend:
   ```bash
   cd backend
   ```
2. Ejecuta la aplicación utilizando Maven:
   ```bash
   mvn spring-boot:run
   ```
3. **Nota Importante:** En el primer arranque, el backend detectará que la base de datos está limpia, creará las tablas automáticamente y poblará las semillas de datos (usuarios iniciales y otras entidades) de forma dinámica.

---

### Paso 3: Ejecutar el Frontend (Angular)

1. Abre **otra terminal** distinta a la del backend.
2. Navega hasta la carpeta del frontend:
   ```bash
   cd frontend
   ```
3. Instala todas las dependencias del proyecto (este paso solo se hace la **primera vez** que descargas el proyecto):
   ```bash
   npm install
   ```
4. Levanta el servidor de desarrollo de Angular:
   ```bash
   npm start
   ```
   _(o puedes usar `ng serve`)_
5. Una vez finalizada la compilación, abre tu navegador y entra a:
   [http://localhost:4200](http://localhost:4200)

---

## 🔑 Credenciales de Acceso por Defecto

Una vez que la aplicación esté corriendo, podrás iniciar sesión usando cualquiera de las siguientes cuentas de prueba creadas automáticamente:

| Rol               | Correo Electrónico       | Contraseña |
| :---------------- | :----------------------- | :--------- |
| **Administrador** | `admin@galaga.com`       | `123456`   |
| **Coordinador**   | `coordinador@galaga.com` | `123456`   |
| **Conductor**     | `conductor@galaga.com`   | `123456`   |

Repositorio del proyecto GALAGA_SAC.
