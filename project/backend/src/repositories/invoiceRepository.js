// Invoice Repository - Data Access Layer
const { pool } = require('../database');
const { v4: uuidv4 } = require('uuid');

class InvoiceRepository {
  /**
   * Find all invoices
   */
  async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM invoices ORDER BY date DESC');
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Find invoice by ID
   */
  async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM invoices WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new invoice
   */
  async create(data) {
    const client = await pool.connect();
    try {
      const id = data.id || `INV-${Date.now()}`;
      const servicesJson = typeof data.services === 'string' 
        ? data.services 
        : JSON.stringify(data.services);
      
      const result = await client.query(
        `INSERT INTO invoices (id, client_name, client_email, vehicle_info, services, total, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          id,
          data.client_name,
          data.client_email,
          data.vehicle_info,
          servicesJson,
          data.total,
          data.status || 'pending'
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Link invoice to appointment
   */
  async linkToAppointment(invoiceId, appointmentId) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE appointments SET invoice_id = $1 WHERE id = $2',
        [invoiceId, appointmentId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Delete invoice
   */
  async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

module.exports = new InvoiceRepository();

