// Client Service - Business Logic
const clientRepository = require('../repositories/clientRepository');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

class ClientService {
  /**
   * Get all clients
   */
  async getAll() {
    return await clientRepository.findAll();
  }

  /**
   * Get client by ID
   */
  async getById(id) {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new NotFoundError('Client');
    }
    return client;
  }

  /**
   * Create a new client
   */
  async create(data) {
    // Check if email already exists
    const existingClient = await clientRepository.findByEmail(data.email);
    if (existingClient) {
      throw new ConflictError('Email already exists', 'email');
    }

    return await clientRepository.create(data);
  }

  /**
   * Update client
   */
  async update(id, data) {
    // Check if client exists
    const existingClient = await clientRepository.findById(id);
    if (!existingClient) {
      throw new NotFoundError('Client');
    }

    // If email is being updated, check for conflicts
    if (data.email && data.email !== existingClient.email) {
      const emailExists = await clientRepository.findByEmail(data.email);
      if (emailExists) {
        throw new ConflictError('Email already exists', 'email');
      }
    }

    return await clientRepository.update(id, data);
  }

  /**
   * Delete client
   */
  async delete(id) {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new NotFoundError('Client');
    }
    return await clientRepository.delete(id);
  }
}

module.exports = new ClientService();

