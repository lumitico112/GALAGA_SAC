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
-- Usuarios son creados programáticamente por DataInitializer en el backend para evitar contraseñas hardcodeadas encriptadas de forma incorrecta.

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
