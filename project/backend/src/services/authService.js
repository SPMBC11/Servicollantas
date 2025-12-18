// Authentication Service - Business Logic
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../repositories/userRepository');
const UnauthorizedError = require('../errors/UnauthorizedError');

class AuthService {
  /**
   * Authenticate user and generate token
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.server.jwtSecret,
      { expiresIn: '8h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }

  /**
   * Generate JWT token for user
   */
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.server.jwtSecret,
      { expiresIn: '8h' }
    );
  }
}

module.exports = new AuthService();

