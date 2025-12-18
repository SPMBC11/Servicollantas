// Appointment Repository - Data Access Layer
const { pool } = require('../database');
const { v4: uuidv4 } = require('uuid');

class AppointmentRepository {
  /**
   * Find all appointments with related data
   */
  async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT a.*, 
               c.name as client_name, c.email as client_email, c.phone as client_phone,
               v.make, v.model, v.year, v.license_plate,
               s.name as service_name, s.price as service_price,
               m.name as mechanic_name, m.email as mechanic_email, m.phone as mechanic_phone
        FROM appointments a
        LEFT JOIN clients c ON a.client_id = c.id
        LEFT JOIN vehicles v ON a.vehicle_id = v.id
        LEFT JOIN services s ON a.service_id = s.id
        LEFT JOIN users m ON a.service_provider_id = m.id
        ORDER BY a.date DESC, a.time DESC
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Find appointments by mechanic ID
   */
  async findByMechanicId(mechanicId) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          a.id,
          c.name as "clientName",
          CONCAT(v.make, ' ', v.model) as "vehicleInfo",
          s.name as "serviceName",
          a.date,
          a.time,
          CASE 
            WHEN a.status = 'pending' THEN 'pendiente'
            WHEN a.status = 'confirmed' THEN 'confirmada'
            WHEN a.status = 'completed' THEN 'completada'
            WHEN a.status = 'cancelled' THEN 'cancelada'
            ELSE a.status
          END as status
        FROM appointments a
        LEFT JOIN clients c ON a.client_id = c.id
        LEFT JOIN vehicles v ON a.vehicle_id = v.id
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.service_provider_id = $1
        ORDER BY a.date DESC, a.time DESC
      `, [mechanicId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Find appointment by ID
   */
  async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM appointments WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Find appointment by ID with related data (for invoice generation)
   */
  async findByIdWithDetails(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT a.*, 
               c.name as client_name, c.email as client_email,
               v.license_plate, v.make, v.model,
               s.name as service_name, s.price as service_price
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN vehicles v ON a.vehicle_id = v.id
        JOIN services s ON a.service_id = s.id
        WHERE a.id = $1
      `, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new appointment
   */
  async create(data) {
    const client = await pool.connect();
    try {
      const id = data.id || uuidv4();
      const result = await client.query(
        `INSERT INTO appointments (id, client_id, vehicle_id, service_id, date, time, notes, status, service_provider_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          id,
          data.client_id,
          data.vehicle_id,
          data.service_id,
          data.date,
          data.time,
          data.notes || '',
          data.status || 'pending',
          data.service_provider_id || null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update appointment
   */
  async update(id, data) {
    const client = await pool.connect();
    try {
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (data.status !== undefined) {
        updates.push(`status = $${paramCount++}`);
        values.push(data.status);
      }
      if (data.notes !== undefined) {
        updates.push(`notes = $${paramCount++}`);
        values.push(data.notes);
      }
      if (data.service_provider_id !== undefined) {
        updates.push(`service_provider_id = $${paramCount++}`);
        values.push(data.service_provider_id);
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await client.query(
        `UPDATE appointments SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Delete appointment
   */
  async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

module.exports = new AppointmentRepository();

