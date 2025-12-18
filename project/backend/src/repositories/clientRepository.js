// Client Repository - Data Access Layer
const { pool } = require('../database');
const { v4: uuidv4 } = require('uuid');

class ClientRepository {
  /**
   * Find all clients
   */
  async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM clients ORDER BY name');
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Find client by ID
   */
  async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM clients WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Find client by email
   */
  async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM clients WHERE email = $1', [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new client
   */
  async create(data) {
    const client = await pool.connect();
    try {
      const id = data.id || uuidv4();
      const result = await client.query(
        'INSERT INTO clients (id, name, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, data.name, data.phone, data.email]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update client
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
      if (data.phone !== undefined) {
        updates.push(`phone = $${paramCount++}`);
        values.push(data.phone);
      }
      if (data.email !== undefined) {
        updates.push(`email = $${paramCount++}`);
        values.push(data.email);
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE clients SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Delete client
   */
  async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

module.exports = new ClientRepository();

