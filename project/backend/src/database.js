const { Pool } = require('pg');
require('dotenv').config();

let pool;

// 🟢 DETECCIÓN AUTOMÁTICA DE ENTORNO
if (process.env.DATABASE_URL) {
  // 🟢 PRODUCCIÓN (Render con SSL)
  console.log('🔗 Conectando en PRODUCCIÓN con DATABASE_URL...');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false 
    }
  });
} else {
  // 🟡 LOCAL (sin SSL porque PostgreSQL local no lo necesita)
  console.log('🔗 Conectando en DESARROLLO (sin SSL)...');
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'servicollantas',
    password: process.env.DB_PASSWORD || 'SPMBarcelona11',
    port: parseInt(process.env.DB_PORT) || 5432,
    // 🔴 NO incluir SSL aquí - local no lo necesita
  });
}

// Función para probar la conexión
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    return false;
  }
}

// Función para inicializar las tablas
async function initializeTables() {
  const client = await pool.connect();
  try {
    // Crear tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'mechanic', 'client')),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de servicios
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de clientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
    `);

    // Crear tabla de vehículos
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(50) PRIMARY KEY,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        license_plate VARCHAR(20) UNIQUE NOT NULL,
        client_id VARCHAR(50) REFERENCES clients(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de facturas
    await client.query(`
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
      )
    `);

    // Crear tabla de citas/reservas
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        client_id VARCHAR(50) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        service_id VARCHAR(50) REFERENCES services(id) ON DELETE SET NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        notes TEXT,
        invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE SET NULL,
        service_provider_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    

    // Crear tabla de calificaciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id VARCHAR(50) PRIMARY KEY,
        appointment_id VARCHAR(50) NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
        mechanic_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        client_name VARCHAR(255),
        client_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(appointment_id)
      )
    `);

    // Crear tabla de tokens de calificación
    await client.query(`
      CREATE TABLE IF NOT EXISTS rating_tokens (
        id VARCHAR(50) PRIMARY KEY,
        appointment_id VARCHAR(50) NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
        token VARCHAR(100) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tablas de base de datos inicializadas correctamente');
  } catch (err) {
    console.error('❌ Error inicializando tablas:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Función para poblar datos iniciales
async function seedInitialData() {
  const client = await pool.connect();
  try {
    console.log('🌱 Verificando datos iniciales...');

    // 1. Verificar e insertar USUARIOS
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('🌱 Sembrando usuarios iniciales...');
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123', 10);
      const mechanicPassword = await bcrypt.hash('mecanico123', 10);
      const clientPassword = await bcrypt.hash('cliente123', 10);

      await client.query(`
        INSERT INTO users (id, email, password_hash, role, name) VALUES
     ('u-admin', 'admin@servicollantas.com', $1, 'admin', 'Administrador'),
     ('u-mech', 'mecanico@example.com', $2, 'mechanic', 'Mecánico'),
     ('u-client', 'cliente@example.com', $3, 'client', 'Cliente')
     ON CONFLICT (email) DO NOTHING
`, [adminPassword, mechanicPassword, clientPassword]);
    } else {
      console.log(`📊 Usuarios ya existen (${userCount.rows[0].count}), saltando creación de usuarios...`);
    }

    // 2. Verificar e insertar SERVICIOS
    const serviceCount = await client.query('SELECT COUNT(*) FROM services');
    if (parseInt(serviceCount.rows[0].count) === 0) {
      console.log('🌱 Sembrando servicios iniciales...');
      await client.query(`
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
ON CONFLICT (id) DO NOTHING
`);     ;
      console.log('✅ Servicios iniciales insertados correctamente');
    } else {
      console.log(`📊 Servicios ya existen (${serviceCount.rows[0].count}), saltando creación de servicios...`);
    }
    
  } catch (err) {
    console.error('❌ Error insertando datos iniciales:', err.message);
    // No lanzamos error para que el servidor inicie aunque falle el seed
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testConnection,
  initializeTables,
  seedInitialData
};
