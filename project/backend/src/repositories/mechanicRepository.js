// Mechanic Repository - Data Access Layer
// Mechanics are users with role='mechanic', but we create a specific repository for mechanic-specific queries
const { pool } = require('../database');

class MechanicRepository {
  /**
   * Find all mechanics with statistics
   */
  async findAllWithStats() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          u.id,
          u.name,
          u.phone,
          u.email,
          COUNT(DISTINCT a.id)::integer as totalappointments,
          SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END)::integer as completedappointments,
          COALESCE(AVG(r.rating), 0)::float as averagerating
        FROM users u
        LEFT JOIN appointments a ON u.id = a.service_provider_id
        LEFT JOIN ratings r ON u.id = r.mechanic_id
        WHERE u.role = 'mechanic'
        GROUP BY u.id, u.name, u.phone, u.email
        ORDER BY u.name
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        totalAppointments: row.totalappointments || 0,
        completedAppointments: row.completedappointments || 0,
        averageRating: parseFloat(row.averagerating) || 0,
        status: 'active'
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Find available mechanics (for client selection)
   */
  async findAvailable() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          u.id,
          u.name,
          u.phone,
          u.email,
          COUNT(DISTINCT a.id)::integer as totalappointments,
          SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END)::integer as completedappointments,
          COALESCE(AVG(r.rating), 0)::float as averagerating
        FROM users u
        LEFT JOIN appointments a ON u.id = a.service_provider_id
        LEFT JOIN ratings r ON u.id = r.mechanic_id
        WHERE u.role = 'mechanic'
        GROUP BY u.id, u.name, u.phone, u.email
        ORDER BY u.name
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        totalAppointments: row.totalappointments || 0,
        completedAppointments: row.completedappointments || 0,
        averageRating: parseFloat(row.averagerating) || 0
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get mechanic profile with appointments and stats
   */
  async getProfile(mechanicId) {
    const client = await pool.connect();
    try {
      // Get mechanic basic info
      const mechanicResult = await client.query(
        `SELECT id, email, name FROM users WHERE id = $1 AND role = 'mechanic'`,
        [mechanicId]
      );

      if (mechanicResult.rows.length === 0) {
        return null;
      }

      const mechanic = mechanicResult.rows[0];

      // Get appointments
      const appointmentsResult = await client.query(`
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

      const appointments = appointmentsResult.rows;

      // Calculate stats
      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(
        (apt) => apt.status === 'completada'
      ).length;

      const today = new Date().toISOString().slice(0, 10);
      const todayAppointments = appointments.filter(
        (apt) => apt.date === today
      ).length;

      // Get average rating
      const ratingResult = await client.query(
        `SELECT COALESCE(AVG(rating), 0)::float as avg_rating
         FROM ratings
         WHERE mechanic_id = $1`,
        [mechanicId]
      );
      const averageRating = parseFloat(ratingResult.rows[0].avg_rating) || 0;

      return {
        mechanic,
        appointments,
        totalAppointments,
        completedAppointments,
        todayAppointments,
        averageRating
      };
    } finally {
      client.release();
    }
  }
}

module.exports = new MechanicRepository();

