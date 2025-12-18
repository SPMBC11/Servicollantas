// Vehicle Repository - Data Access Layer
const { pool } = require('../database');
const { v4: uuidv4 } = require('uuid');

class VehicleRepository {
  /**
   * Find all vehicles with client info
   */
  async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT v.*, c.name as client_name, c.email as client_email 
        FROM vehicles v 
        LEFT JOIN clients c ON v.client_id = c.id 
        ORDER BY v.make, v.model
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Find vehicle by ID
   */
  async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM vehicles WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Find vehicles by client ID
   */
  async findByClientId(clientId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM vehicles WHERE client_id = $1 ORDER BY make, model',
        [clientId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new vehicle
   */
  async create(data) {
    const client = await pool.connect();
    try {
      const id = data.id || uuidv4();
      const result = await client.query(
        'INSERT INTO vehicles (id, make, model, year, license_plate, client_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, data.make, data.model, data.year, data.license_plate, data.client_id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update vehicle
   */
  async update(id, data) {
    const client = await pool.connect();
    try {
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (data.make !== undefined) {
        updates.push(`make = $${paramCount++}`);
        values.push(data.make);
      }
      if (data.model !== undefined) {
        updates.push(`model = $${paramCount++}`);
        values.push(data.model);
      }
      if (data.year !== undefined) {
        updates.push(`year = $${paramCount++}`);
        values.push(data.year);
      }
      if (data.license_plate !== undefined) {
        updates.push(`license_plate = $${paramCount++}`);
        values.push(data.license_plate);
      }
      if (data.client_id !== undefined) {
        updates.push(`client_id = $${paramCount++}`);
        values.push(data.client_id);
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Delete vehicle
   */
  async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

module.exports = new VehicleRepository();

