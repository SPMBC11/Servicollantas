// Service Service - Business Logic
const serviceRepository = require('../repositories/serviceRepository');
const NotFoundError = require('../errors/NotFoundError');

class ServiceService {
  /**
   * Get all services
   */
  async getAll() {
    return await serviceRepository.findAll();
  }

  /**
   * Get service by ID
   */
  async getById(id) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundError('Service');
    }
    return service;
  }

  /**
   * Create a new service
   */
  async create(data) {
    return await serviceRepository.create(data);
  }

  /**
   * Update service
   */
  async update(id, data) {
    const existingService = await serviceRepository.findById(id);
    if (!existingService) {
      throw new NotFoundError('Service');
    }
    return await serviceRepository.update(id, data);
  }

  /**
   * Delete service
   */
  async delete(id) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundError('Service');
    }
    return await serviceRepository.delete(id);
  }
}

module.exports = new ServiceService();

