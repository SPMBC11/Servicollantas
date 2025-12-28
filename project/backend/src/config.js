/**
 * ======================================
 * CONFIGURACIÓN DE LA APLICACIÓN
 * ======================================
 * 
 * 🔐 SEGURIDAD:
 * - En PRODUCCIÓN (Render): Las credenciales están en variables de entorno seguras
 * - En DESARROLLO (Local): Se usan variables del archivo .env
 * - NUNCA hardcodear secretos en este archivo
 * 
 * ⚠️  IMPORTANTE:
 * - No commit variables sensibles a GitHub
 * - Usar .env.example como plantilla (sin valores reales)
 * - El archivo .env debe estar en .gitignore
 */

require('dotenv').config();

/**
 * Obtener configuración de base de datos
 * En producción usa DATABASE_URL (más seguro)
 * En desarrollo usa variables individuales
 */
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    // 🟢 PRODUCCIÓN (Render con DATABASE_URL)
    console.log('🔗 Conectando en PRODUCCIÓN con DATABASE_URL...');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { 
        rejectUnauthorized: false 
      }
    };
  }
  
  // 🟡 DESARROLLO (Variables individuales de .env)
  console.log('🔗 Conectando en DESARROLLO con variables de .env...');
  
  // Validar que todas las variables requeridas están presentes
  const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = requiredEnv.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Variables de entorno faltantes: ${missing.join(', ')}\n` +
      `Asegúrate de que tu archivo .env contiene todas las variables requeridas.\n` +
      `Referencia: .env.example en la raíz del proyecto backend`
    );
  }
  
  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
  };
};

/**
 * Validar JWT_SECRET en producción
 */
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error(
      '❌ JWT_SECRET no está configurado en producción.\n' +
      'Configúralo en las variables de entorno de Render.'
    );
  }
  
  // En desarrollo, usar un valor por defecto si no existe
  return secret || 'dev-servi-collantas-local-secret-2025';
};

/**
 * Exportar configuración
 */
module.exports = {
  // ==========================================
  // CONFIGURACIÓN DE BASE DE DATOS
  // ==========================================
  database: getDatabaseConfig(),
  
  // ==========================================
  // CONFIGURACIÓN DEL SERVIDOR
  // ==========================================
  server: {
    port: parseInt(process.env.PORT) || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: getJwtSecret(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  // ==========================================
  // CONFIGURACIÓN DE WHATSAPP
  // ==========================================
  whatsapp: {
    phone: process.env.WHATSAPP_PHONE || '573053113534',
  },
  
  // ==========================================
  // UTILIDADES
  // ==========================================
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

