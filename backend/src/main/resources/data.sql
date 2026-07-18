-- Seed data for testing the GALAGA_SAC system
-- Default password for users: password123 (BCrypt hashed)

-- Clean existing data first
TRUNCATE TABLE entrega CASCADE;
TRUNCATE TABLE incidencia CASCADE;
TRUNCATE TABLE material_electoral CASCADE;
TRUNCATE TABLE ruta CASCADE;
TRUNCATE TABLE vehiculo CASCADE;
TRUNCATE TABLE conductor CASCADE;
TRUNCATE TABLE operador CASCADE;
TRUNCATE TABLE usuario CASCADE;

-- Insert Usuarios
INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES
('Administrador Galaga', 'admin@galaga.com', '$2a$10$8.UnVuG9HHgffUDAlk8GP.35GL7H1YV.eC6bM4j6lF7d1/eHlZ3wO', 'ADMIN'),
('Coordinador Logistico', 'coordinador@galaga.com', '$2a$10$8.UnVuG9HHgffUDAlk8GP.35GL7H1YV.eC6bM4j6lF7d1/eHlZ3wO', 'COORDINADOR'),
('Conductor Principal', 'conductor@galaga.com', '$2a$10$8.UnVuG9HHgffUDAlk8GP.35GL7H1YV.eC6bM4j6lF7d1/eHlZ3wO', 'CONDUCTOR');

-- Insert Operadores
INSERT INTO operador (nombre, telefono) VALUES
('Oscar Benavides', '987123456'),
('Monica Flores', '987654123');

-- Insert Conductores
INSERT INTO conductor (nombre, licencia, telefono, estado) VALUES
('Carlos Mendoza', 'A-123456', '999888777', 'Disponible'),
('Eduardo Lopez', 'B-765432', '999222111', 'Disponible'),
('Javier Rivas', 'C-998877', '999333444', 'Disponible');

-- Insert Vehículos
INSERT INTO vehiculo (placa, tipo, capacidad, estado, gps) VALUES
('F1A-789', 'Furgon Cerrado 10m³', 10.00, 'Disponible', 'GPS-101'),
('B2B-456', 'Plataforma 20m³', 20.00, 'Disponible', 'GPS-102'),
('C3C-112', 'Cisterna 15m³', 15.00, 'Disponible', 'GPS-103');
