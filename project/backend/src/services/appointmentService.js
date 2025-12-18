// Appointment Service - Business Logic
const appointmentRepository = require('../repositories/appointmentRepository');
const clientRepository = require('../repositories/clientRepository');
const userRepository = require('../repositories/userRepository');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

class AppointmentService {
  /**
   * Get all appointments
   */
  async getAll() {
    return await appointmentRepository.findAll();
  }

  /**
   * Get appointments by mechanic ID
   */
  async getByMechanicId(mechanicId) {
    return await appointmentRepository.findByMechanicId(mechanicId);
  }

  /**
   * Get appointment by ID
   */
  async getById(id) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundError('Appointment');
    }
    return appointment;
  }

  /**
   * Create a new appointment
   */
  async create(data, user) {
    // Ensure client exists in clients table
    let client = await clientRepository.findById(data.client_id);
    
    if (!client) {
      // Create client if doesn't exist
      client = await clientRepository.create({
        id: data.client_id,
        name: data.client_name || user.name || 'Cliente',
        email: data.client_email || user.email || '',
        phone: data.client_phone || user.phone || ''
      });
    }

    // Validate mechanic if provided
    if (data.service_provider_id) {
      const mechanic = await userRepository.findById(data.service_provider_id);
      if (!mechanic || mechanic.role !== 'mechanic') {
        throw new ValidationError('Invalid mechanic ID');
      }
    }

    return await appointmentRepository.create(data);
  }

  /**
   * Update appointment
   */
  async update(id, data) {
    const existingAppointment = await appointmentRepository.findById(id);
    if (!existingAppointment) {
      throw new NotFoundError('Appointment');
    }

    // Validate mechanic if being updated
    if (data.service_provider_id !== undefined && data.service_provider_id !== null) {
      const mechanic = await userRepository.findById(data.service_provider_id);
      if (!mechanic || mechanic.role !== 'mechanic') {
        throw new ValidationError('Invalid mechanic ID');
      }
    }

    return await appointmentRepository.update(id, data);
  }

  /**
   * Delete appointment
   */
  async delete(id) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundError('Appointment');
    }
    return await appointmentRepository.delete(id);
  }
}

module.exports = new AppointmentService();

