// User Repository - Data Access Layer
const { pool } = require('../database');

class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, email, password_hash, role, name, phone FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, email, role, name, phone FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Find users by role
   */
  async findByRole(role) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, email, role, name, phone FROM users WHERE role = $1 ORDER BY name',
        [role]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new user
   */
  async create(data) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (id, email, password_hash, role, name, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, name, phone',
        [data.id, data.email, data.password_hash, data.role, data.name, data.phone]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update user
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
      if (data.email !== undefined) {
        updates.push(`email = $${paramCount++}`);
        values.push(data.email);
      }
      if (data.phone !== undefined) {
        updates.push(`phone = $${paramCount++}`);
        values.push(data.phone);
      }
      if (data.password_hash !== undefined) {
        updates.push(`password_hash = $${paramCount++}`);
        values.push(data.password_hash);
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, role, name, phone`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Delete user
   */
  async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

module.exports = new UserRepository();

