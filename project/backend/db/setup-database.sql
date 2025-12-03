-- Script para configurar la base de datos PostgreSQL de ServiCollantas
-- Ejecutar como superusuario de PostgreSQL

-- Crear la base de datos
CREATE DATABASE servicollantas;

-- Crear usuario (opcional, puedes usar el usuario postgres por defecto)
-- CREATE USER servicollantas_user WITH PASSWORD 'servicollantas_password';

-- Dar permisos al usuario (si creaste uno específico)
-- GRANT ALL PRIVILEGES ON DATABASE servicollantas TO servicollantas_user;

-- Conectar a la base de datos
\c servicollantas;

-- Crear las tablas (estas se crearán automáticamente cuando ejecutes el servidor)
-- Pero aquí tienes el script por si quieres crearlas manualmente

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'mechanic', 'client')),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(50) PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  client_id VARCHAR(50) REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de citas/reservas
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_id VARCHAR(50) REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  service_provider_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  vehicle_info VARCHAR(255) NOT NULL,
  services JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales
-- Usuarios (las contraseñas se hashean en el servidor)
INSERT INTO users (id, email, password_hash, role, name) VALUES
('u-admin', 'admin@servicollantas.com', '$2a$10$hWIweHaZl/BHZkMWS/0h6ub9QUlei.69x7i3zotr8jGEp3b/peSM.', 'admin', 'Administrador'),
('u-mech', 'mechanic@servicollantas.com', '$2a$10$CwTycUXWue0Thq9StjUM0u', 'mechanic', 'Mecánico')
ON CONFLICT (id) DO NOTHING;

-- Servicios
INSERT INTO services (id, name, description, price, duration) VALUES
('srv001', 'Cambio de Aceite', 'Cambio de aceite de motor y filtro', 50.00, 30),
('srv002', 'Rotación y Balanceo de Llantas', 'Rotación de llantas y balanceo de las cuatro ruedas', 40.00, 45),
('srv003', 'Alineación', 'Alineación de dirección', 60.00, 60),
('srv004', 'Revisión de Frenos', 'Inspección y ajuste de sistema de frenos', 35.00, 30),
('srv005', 'Cambio de Llantas', 'Instalación profesional de llantas nuevas y usadas', 80.00, 60),
('srv006', 'Alineación y Balanceo', 'Servicio completo de alineación computarizada', 45.00, 60),
('srv007', 'Reparación de Llantas', 'Reparamos pinchazos, cortes laterales y daños menores', 15.00, 30),
('srv008', 'Mantenimiento General', 'Revisión completa del sistema de suspensión', 60.00, 90),
('srv009', 'Servicio a Domicilio', 'Llevamos nuestros servicios hasta donde te encuentres', 0.00, 120),
('srv010', 'Inspección Vehicular', 'Revisión técnico-mecánica y de emisiones', 120.00, 90)
ON CONFLICT (id) DO NOTHING;

-- Mensaje de confirmación
SELECT 'Base de datos ServiCollantas configurada correctamente!' as status;
