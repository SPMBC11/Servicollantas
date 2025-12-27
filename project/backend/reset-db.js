// Reset database script
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'SPMBarcelona11',
  host: 'localhost',
  port: 5432,
  database: 'servicollantas'
});

async function resetDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔄 Dropping all tables...');
    
    const tables = [
      'appointments',
      'invoices',
      'ratings',
      'vehicles',
      'clients',
      'services',
      'users'
    ];

    for (const table of tables) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (err) {
        console.log(`⚠️  Could not drop ${table}: ${err.message}`);
      }
    }

    console.log('✅ All tables dropped successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
