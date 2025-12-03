// Script de prueba para verificar la conexión a PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'servicollantas',
  password: 'SPMBarcelona11',
  port: 5432,
});

async function testDatabase() {
  console.log('🔍 Probando conexión a PostgreSQL...');
  
  try {
    // Probar conexión
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar tablas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Tablas encontradas:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verificar datos de usuarios
    const users = await client.query('SELECT id, email, role, name FROM users');
    console.log('\n👥 Usuarios:');
    users.rows.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    // Verificar servicios
    const services = await client.query('SELECT id, name, price FROM services LIMIT 5');
    console.log('\n🛠️ Servicios:');
    services.rows.forEach(service => {
      console.log(`  - ${service.name} - $${service.price}`);
    });
    
    // Verificar estadísticas
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM services) as services_count,
        (SELECT COUNT(*) FROM clients) as clients_count,
        (SELECT COUNT(*) FROM vehicles) as vehicles_count,
        (SELECT COUNT(*) FROM appointments) as appointments_count,
        (SELECT COUNT(*) FROM invoices) as invoices_count
    `);
    
    console.log('\n📈 Estadísticas:');
    const stat = stats.rows[0];
    console.log(`  - Usuarios: ${stat.users_count}`);
    console.log(`  - Servicios: ${stat.services_count}`);
    console.log(`  - Clientes: ${stat.clients_count}`);
    console.log(`  - Vehículos: ${stat.vehicles_count}`);
    console.log(`  - Citas: ${stat.appointments_count}`);
    console.log(`  - Facturas: ${stat.invoices_count}`);
    
    client.release();
    console.log('\n🎉 Base de datos funcionando correctamente!');
    
  } catch (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    console.log('\n💡 Soluciones posibles:');
    console.log('  1. Verificar que PostgreSQL esté ejecutándose');
    console.log('  2. Verificar las credenciales de conexión');
    console.log('  3. Verificar que la base de datos "servicollantas" exista');
    console.log('  4. Ejecutar el script setup-database.sql');
  } finally {
    await pool.end();
  }
}

testDatabase();
