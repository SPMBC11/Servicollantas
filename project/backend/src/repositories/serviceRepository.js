// Service Repository - Data Access Layer
const { pool } = require('../database');
const { v4: uuidv4 } = require('uuid');

class ServiceRepository {
  /**
   * Find all services
   */
  async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM services ORDER BY name');
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Find service by ID
   */
  async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM services WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new service
   */
  async create(data) {
    const client = await pool.connect();
    try {
      const id = data.id || `srv${Date.now()}`;
      const result = await client.query(
        'INSERT INTO services (id, name, description, price, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, data.name, data.description || null, data.price, data.duration]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update service
   */
  async update(id, data) {
    const client = await pool.connect();
    try {
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (data.name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(data.name);
      }
      if (data.description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(data.description);
      }
      if (data.price !== undefined) {
        updates.push(`price = $${paramCount++}`);
        values.push(data.price);
      }
      if (data.duration !== undefined) {
        updates.push(`duration = $${paramCount++}`);
        values.push(data.duration);
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE services SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Delete service
   */
  async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

module.exports = new ServiceRepository();

