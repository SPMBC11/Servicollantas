// Check password hash in database
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: 'postgres',
  password: 'SPMBarcelona11',
  host: 'localhost',
  port: 5432,
  database: 'servicollantas'
});

async function checkPassword() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT email, password_hash FROM users WHERE email = $1',
      ['admin@servicollantas.com']
    );

    if (result.rows.length === 0) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('📋 Admin user found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Hash: ${user.password_hash}`);

    // Test password
    const testPassword = 'admin123';
    const match = bcrypt.compareSync(testPassword, user.password_hash);
    console.log(`\n🔐 Password verification for '${testPassword}': ${match ? '✅ VALID' : '❌ INVALID'}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

checkPassword();
