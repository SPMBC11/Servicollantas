// Vehicle Service - Business Logic
const vehicleRepository = require('../repositories/vehicleRepository');
const clientRepository = require('../repositories/clientRepository');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');

class VehicleService {
  /**
   * Get all vehicles
   */
  async getAll() {
    return await vehicleRepository.findAll();
  }

  /**
   * Get vehicle by ID
   */
  async getById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    return vehicle;
  }

  /**
   * Get vehicles by client ID
   */
  async getByClientId(clientId) {
    return await vehicleRepository.findByClientId(clientId);
  }

  /**
   * Create a new vehicle
   */
  async create(data, user) {
    // Determine client_id based on user role
    let finalClientId = data.client_id;
    
    if (user.role === 'client') {
      finalClientId = user.id;
    } else if (!finalClientId) {
      finalClientId = user.id;
    }

    // Ensure client exists
    const client = await clientRepository.findById(finalClientId);
    if (!client) {
      // Create client if doesn't exist (for admin/mechanic creating vehicles)
      await clientRepository.create({
        id: finalClientId,
        name: user.name || 'User',
        email: user.email || '',
        phone: ''
      });
    }

    return await vehicleRepository.create({
      ...data,
      client_id: finalClientId
    });
  }

  /**
   * Update vehicle
   */
  async update(id, data) {
    const existingVehicle = await vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new NotFoundError('Vehicle');
    }
    return await vehicleRepository.update(id, data);
  }

  /**
   * Delete vehicle
   */
  async delete(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    return await vehicleRepository.delete(id);
  }
}

module.exports = new VehicleService();

