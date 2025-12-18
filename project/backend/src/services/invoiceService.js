// Invoice Service - Business Logic
const invoiceRepository = require('../repositories/invoiceRepository');
const appointmentRepository = require('../repositories/appointmentRepository');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

class InvoiceService {
  /**
   * Get all invoices
   */
  async getAll() {
    const invoices = await invoiceRepository.findAll();
    return invoices.map(inv => ({
      id: inv.id,
      clientName: inv.client_name,
      clientEmail: inv.client_email,
      vehicle: inv.vehicle_info,
      services: typeof inv.services === 'string' ? JSON.parse(inv.services) : inv.services || [],
      total: parseFloat(inv.total) || 0,
      date: inv.date,
      status: inv.status === 'pending' ? 'pendiente' : 'pagada'
    }));
  }

  /**
   * Get invoice by ID
   */
  async getById(id) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) {
      throw new NotFoundError('Invoice');
    }

    return {
      id: invoice.id,
      clientName: invoice.client_name,
      clientEmail: invoice.client_email,
      vehicle: invoice.vehicle_info,
      services: typeof invoice.services === 'string' ? JSON.parse(invoice.services) : invoice.services || [],
      total: parseFloat(invoice.total) || 0,
      date: invoice.date,
      status: invoice.status === 'pending' ? 'pendiente' : 'pagada'
    };
  }

  /**
   * Create a new invoice
   */
  async create(data) {
    return await invoiceRepository.create(data);
  }

  /**
   * Generate invoice from completed appointment
   */
  async generateFromAppointment(appointmentId) {
    // Get appointment details with related data
    const appointment = await appointmentRepository.findByIdWithDetails(appointmentId);
    if (!appointment) {
      throw new NotFoundError('Appointment');
    }

    if (appointment.status !== 'completed') {
      throw new ValidationError('Appointment must be completed to generate invoice');
    }

    const invoiceId = `INV-${Date.now()}`;
    const vehicleInfo = `${appointment.make} ${appointment.model} (${appointment.license_plate})`;
    const services = [{ 
      id: appointment.service_id, 
      name: appointment.service_name, 
      price: parseFloat(appointment.service_price) || 0 
    }];
    const total = parseFloat(appointment.service_price) || 0;

    const invoice = await invoiceRepository.create({
      id: invoiceId,
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      vehicle_info: vehicleInfo,
      services: services,
      total: total,
      status: 'paid'
    });

    // Link invoice to appointment
    await invoiceRepository.linkToAppointment(invoiceId, appointmentId);

    return invoice;
  }

  /**
   * Delete invoice
   */
  async delete(id) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) {
      throw new NotFoundError('Invoice');
    }
    return await invoiceRepository.delete(id);
  }
}

module.exports = new InvoiceService();

