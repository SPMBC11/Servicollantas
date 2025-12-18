// Mechanic Service - Business Logic
const mechanicRepository = require('../repositories/mechanicRepository');
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const roles = require('../constants/roles');

class MechanicService {
  /**
   * Get all mechanics with statistics
   */
  async getAll() {
    return await mechanicRepository.findAllWithStats();
  }

  /**
   * Get available mechanics (for client selection)
   */
  async getAvailable() {
    return await mechanicRepository.findAvailable();
  }

  /**
   * Get mechanic profile
   */
  async getProfile(mechanicId) {
    const profile = await mechanicRepository.getProfile(mechanicId);
    if (!profile) {
      throw new NotFoundError('Mechanic');
    }
    return profile;
  }

  /**
   * Get mechanic by ID
   */
  async getById(id) {
    const mechanic = await userRepository.findById(id);
    if (!mechanic || mechanic.role !== roles.MECHANIC) {
      throw new NotFoundError('Mechanic');
    }
    return mechanic;
  }

  /**
   * Create a new mechanic
   */
  async create(data) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered', 'email');
    }

    // Generate random password
    const password = Math.random().toString(36).substring(2, 10);
    const passwordHash = await bcrypt.hash(password, 10);
    const mechanicId = data.id || `mechanic-${Date.now()}`;

    const mechanic = await userRepository.create({
      id: mechanicId,
      email: data.email,
      password_hash: passwordHash,
      role: roles.MECHANIC,
      name: data.name,
      phone: data.phone
    });

    return {
      mechanic: {
        id: mechanic.id,
        name: mechanic.name,
        email: mechanic.email,
        phone: mechanic.phone
      },
      credentials: {
        email: data.email,
        password: password,
        message: "⚠️ IMPORTANTE: Guarda estas credenciales. No se mostrarán de nuevo."
      }
    };
  }

  /**
   * Update mechanic
   */
  async update(id, data) {
    const existingMechanic = await this.getById(id);

    // Check email conflict if updating email
    if (data.email && data.email !== existingMechanic.email) {
      const emailExists = await userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new ConflictError('Email already registered', 'email');
      }
    }

    return await userRepository.update(id, data);
  }

  /**
   * Regenerate mechanic password
   */
  async regeneratePassword(id) {
    const mechanic = await this.getById(id);

    const newPassword = Math.random().toString(36).substring(2, 10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.update(id, { password_hash: hashedPassword });

    return {
      message: "Contraseña regenerada exitosamente",
      password: newPassword,
      email: mechanic.email
    };
  }

  /**
   * Update mechanic profile (name and password)
   */
  async updateProfile(mechanicId, data) {
    const mechanic = await this.getById(mechanicId);

    // If changing password, verify current password
    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new ValidationError('Current password is required');
      }

      const user = await userRepository.findByEmail(mechanic.email);
      if (!bcrypt.compareSync(data.currentPassword, user.password_hash)) {
        throw new ValidationError('Current password is incorrect');
      }

      const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
      await userRepository.update(mechanicId, { password_hash: newPasswordHash });
    }

    // Update name if provided
    if (data.name) {
      await userRepository.update(mechanicId, { name: data.name });
    }

    return await this.getById(mechanicId);
  }

  /**
   * Delete mechanic
   */
  async delete(id) {
    const mechanic = await this.getById(id);
    return await userRepository.delete(id);
  }
}

module.exports = new MechanicService();

