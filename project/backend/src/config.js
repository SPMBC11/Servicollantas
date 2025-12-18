// Configuración de la aplicación
// ⚠️ IMPORTANTE: En producción, TODAS las variables deben estar en .env
// No usar valores por defecto para datos sensibles

module.exports = {
  // Configuración de la base de datos PostgreSQL
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'servicollantas',
    user: process.env.DB_USER || 'postgres',
    // ⚠️ En producción, DB_PASSWORD DEBE estar en .env (sin valor por defecto)
    password: process.env.DB_PASSWORD || (process.env.NODE_ENV === 'production' ? (() => {
      throw new Error('DB_PASSWORD must be set in production environment');
    })() : 'SPMBarcelona11'),
  },
  
  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT) || 4000,
    // ⚠️ En producción, JWT_SECRET DEBE estar en .env y ser MUY largo y seguro
    jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? (() => {
      throw new Error('JWT_SECRET must be set in production environment');
    })() : 'dev-secret-servi-collantas-2025'),
  },
  
  // Configuración de WhatsApp
  whatsapp: {
    phone: process.env.WHATSAPP_PHONE || '573053113534',
  }
};
