// Configuración de la aplicación
module.exports = {
  // Configuración de la base de datos PostgreSQL
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'servicollantas',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'SPMBarcelona11',
  },
  
  // Configuración del servidor
  server: {
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-servi-collantas-2025',
  },
  
  // Configuración de WhatsApp
  whatsapp: {
    phone: process.env.WHATSAPP_PHONE || '573053113534',
  }
};
