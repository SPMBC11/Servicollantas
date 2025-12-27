// Verify password hash
const bcrypt = require('bcryptjs');

const password = 'admin123';
const storedHash = '$2a$10$...'; // Will be replaced by DB value

async function verifyPassword() {
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash generated:', hash);
  
  // Test if comparison works
  const match = bcrypt.compareSync(password, hash);
  console.log('Password match:', match);
}

verifyPassword();
