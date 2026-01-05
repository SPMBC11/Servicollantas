const { pool } = require('./src/database');

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname='public'
      ORDER BY tablename
    `);
    
    console.log('Tablas disponibles:');
    result.rows.forEach(row => console.log('  -', row.tablename));
    
    // Check if appointments table exists
    const appointmentsExists = result.rows.some(r => r.tablename === 'appointments');
    const bookingsExists = result.rows.some(r => r.tablename === 'bookings');
    
    console.log('\nTabla appointments existe:', appointmentsExists);
    console.log('Tabla bookings existe:', bookingsExists);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();