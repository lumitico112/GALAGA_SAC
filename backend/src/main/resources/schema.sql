-- Drop tables if they exist to allow clean initialization
DROP TABLE IF EXISTS entrega CASCADE;
DROP TABLE IF EXISTS incidencia CASCADE;
DROP TABLE IF EXISTS material_electoral CASCADE;
DROP TABLE IF EXISTS ruta CASCADE;
DROP TABLE IF EXISTS vehiculo CASCADE;
DROP TABLE IF EXISTS conductor CASCADE;
DROP TABLE IF EXISTS operador CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- Table: usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL
);

-- Table: operador
CREATE TABLE operador (
    id_operador SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20)
);

-- Table: conductor
CREATE TABLE conductor (
    id_conductor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    licencia VARCHAR(20) NOT NULL,
    telefono VARCHAR(20),
    estado VARCHAR(20) NOT NULL DEFAULT 'Disponible'
);

-- Table: vehiculo
CREATE TABLE vehiculo (
    id_vehiculo SERIAL PRIMARY KEY,
    placa VARCHAR(15) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    capacidad DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Disponible',
    gps VARCHAR(50)
);

-- Table: ruta
CREATE TABLE ruta (
    id_ruta SERIAL PRIMARY KEY,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    fecha_salida TIMESTAMP,
    fecha_llegada TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'Planificada',
    id_conductor INT REFERENCES conductor(id_conductor),
    id_vehiculo INT REFERENCES vehiculo(id_vehiculo),
    id_operador INT REFERENCES operador(id_operador)
);

-- Table: material_electoral
CREATE TABLE material_electoral (
    id_material SERIAL PRIMARY KEY,
    descripcion VARCHAR(150) NOT NULL,
    cantidad INT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'En Almacen',
    id_ruta INT REFERENCES ruta(id_ruta) ON DELETE SET NULL
);

-- Table: incidencia
CREATE TABLE incidencia (
    id_incidencia SERIAL PRIMARY KEY,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Reportada',
    id_ruta INT REFERENCES ruta(id_ruta) ON DELETE CASCADE
);

-- Table: entrega
CREATE TABLE entrega (
    id_entrega SERIAL PRIMARY KEY,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'Entregado',
    observacion TEXT,
    id_ruta INT UNIQUE REFERENCES ruta(id_ruta) ON DELETE CASCADE
);
