// Check users in database
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'SPMBarcelona11',
  host: 'localhost',
  port: 5432,
  database: 'servicollantas'
});

async function checkUsers() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, email, role FROM users');
    console.log('📋 Usuarios en la BD:');
    result.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUsers();
