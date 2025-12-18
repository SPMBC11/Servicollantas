// Report Service - Business Logic
const { pool } = require('../database');
const ValidationError = require('../errors/ValidationError');

class ReportService {
  /**
   * Generate report data
   */
  async generateReport(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new ValidationError('startDate and endDate are required');
    }

    const client = await pool.connect();
    try {
      // Total appointments in range
      const appointmentsResult = await client.query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
         FROM appointments 
         WHERE DATE(date) >= $1 AND DATE(date) <= $2`,
        [startDate, endDate]
      );

      const stats = appointmentsResult.rows[0];

      // Service breakdown
      const servicesResult = await client.query(
        `SELECT 
          s.name as service_name,
          COUNT(a.id) as count,
          COALESCE(SUM(s.price), 0) as revenue
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE DATE(a.date) >= $1 AND DATE(a.date) <= $2 AND a.status = 'completed'
         GROUP BY s.id, s.name
         ORDER BY count DESC`,
        [startDate, endDate]
      );

      // Appointments by day
      const appointmentsByDayResult = await client.query(
        `SELECT 
          DATE(date) as date,
          COUNT(*) as count
         FROM appointments
         WHERE DATE(date) >= $1 AND DATE(date) <= $2
         GROUP BY DATE(date)
         ORDER BY DATE(date)`,
        [startDate, endDate]
      );

      // Calculate total revenue
      const revenueResult = await client.query(
        `SELECT COALESCE(SUM(s.price), 0) as total_revenue
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE DATE(a.date) >= $1 AND DATE(a.date) <= $2 AND a.status = 'completed'`,
        [startDate, endDate]
      );

      return {
        totalAppointments: parseInt(stats.total) || 0,
        completedAppointments: parseInt(stats.completed) || 0,
        pendingAppointments: parseInt(stats.pending) || 0,
        cancelledAppointments: parseInt(stats.cancelled) || 0,
        totalRevenue: parseFloat(revenueResult.rows[0].total_revenue) || 0,
        serviceBreakdown: servicesResult.rows.map(row => ({
          service_name: row.service_name,
          count: parseInt(row.count),
          revenue: parseFloat(row.revenue)
        })),
        appointmentsByDay: appointmentsByDayResult.rows.map(row => ({
          date: row.date.toISOString().split('T')[0],
          count: parseInt(row.count)
        }))
      };
    } finally {
      client.release();
    }
  }
}

module.exports = new ReportService();

