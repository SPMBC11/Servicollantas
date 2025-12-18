// Rating Repository - Data Access Layer
const { pool } = require('../database');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class RatingRepository {
  /**
   * Find rating by appointment ID
   */
  async findByAppointmentId(appointmentId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM ratings WHERE appointment_id = $1',
        [appointmentId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new rating
   */
  async create(data) {
    const client = await pool.connect();
    try {
      const id = data.id || `rating-${Date.now()}`;
      const result = await client.query(
        `INSERT INTO ratings (id, appointment_id, mechanic_id, rating, comments, client_id) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          id,
          data.appointment_id,
          data.mechanic_id,
          data.rating,
          data.comments || null,
          data.client_id || null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Get average rating for mechanic
   */
  async getAverageByMechanicId(mechanicId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COALESCE(AVG(rating), 0)::float as avg_rating
         FROM ratings
         WHERE mechanic_id = $1`,
        [mechanicId]
      );
      return parseFloat(result.rows[0].avg_rating) || 0;
    } finally {
      client.release();
    }
  }
}

class RatingTokenRepository {
  /**
   * Create rating token
   */
  async create(appointmentId, expiresAt) {
    const client = await pool.connect();
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const id = `rt-${Date.now()}`;
      
      const result = await client.query(
        `INSERT INTO rating_tokens (id, appointment_id, token, expires_at) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, appointmentId, token, expiresAt]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Find token by token string
   */
  async findByToken(token) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT rt.*, a.service_provider_id as mechanic_id, a.id as appointment_id
         FROM rating_tokens rt
         JOIN appointments a ON rt.appointment_id = a.id
         WHERE rt.token = $1 AND rt.used = FALSE AND rt.expires_at > NOW()`,
        [token]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Get token info with appointment details
   */
  async getTokenInfo(token) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT rt.*, a.id as appointment_id, a.date, a.time,
                c.name as client_name, c.email as client_email,
                CONCAT(v.make, ' ', v.model) as vehicle_info,
                s.name as service_name,
                m.name as mechanic_name, m.id as mechanic_id
         FROM rating_tokens rt
         JOIN appointments a ON rt.appointment_id = a.id
         JOIN clients c ON a.client_id = c.id
         JOIN vehicles v ON a.vehicle_id = v.id
         LEFT JOIN services s ON a.service_id = s.id
         JOIN users m ON a.service_provider_id = m.id
         WHERE rt.token = $1 AND rt.used = FALSE AND rt.expires_at > NOW()`,
        [token]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Mark token as used
   */
  async markAsUsed(tokenId) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE rating_tokens SET used = TRUE WHERE id = $1',
        [tokenId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Check if rating exists for appointment
   */
  async checkRatingExists(appointmentId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id FROM ratings WHERE appointment_id = $1',
        [appointmentId]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

module.exports = {
  ratingRepository: new RatingRepository(),
  ratingTokenRepository: new RatingTokenRepository()
};

