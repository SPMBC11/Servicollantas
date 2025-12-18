// Rating Service - Business Logic
const { ratingRepository, ratingTokenRepository } = require('../repositories/ratingRepository');
const appointmentRepository = require('../repositories/appointmentRepository');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

class RatingService {
  /**
   * Generate rating link for completed appointment
   */
  async generateLink(appointmentId) {
    // Verify appointment exists and is completed
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundError('Appointment');
    }

    if (appointment.status !== 'completed') {
      throw new ValidationError('Appointment must be completed to generate rating link');
    }

    if (!appointment.service_provider_id) {
      throw new ValidationError('Appointment does not have an assigned mechanic');
    }

    // Check if rating already exists
    const ratingExists = await ratingTokenRepository.checkRatingExists(appointmentId);
    if (ratingExists) {
      throw new ConflictError('This appointment has already been rated');
    }

    // Generate token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days

    const tokenData = await ratingTokenRepository.create(appointmentId, expiresAt);

    // Generate frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const ratingUrl = `${frontendUrl}/rate/${tokenData.token}`;

    return {
      token: tokenData.token,
      url: ratingUrl,
      expiresAt: expiresAt.toISOString(),
      message: "Link de calificación generado exitosamente"
    };
  }

  /**
   * Get rating token info
   */
  async getTokenInfo(token) {
    const tokenData = await ratingTokenRepository.getTokenInfo(token);
    if (!tokenData) {
      throw new NotFoundError('Rating token');
    }

    return {
      appointmentId: tokenData.appointment_id,
      mechanicId: tokenData.mechanic_id,
      mechanicName: tokenData.mechanic_name,
      clientName: tokenData.client_name,
      vehicleInfo: tokenData.vehicle_info,
      serviceName: tokenData.service_name,
      date: tokenData.date,
      time: tokenData.time
    };
  }

  /**
   * Submit rating
   */
  async submit(data) {
    const { token, rating, comments, clientName, clientEmail } = data;

    // Validate token
    const tokenData = await ratingTokenRepository.findByToken(token);
    if (!tokenData) {
      throw new NotFoundError('Rating token');
    }

    // Check if already rated
    const ratingExists = await ratingRepository.findByAppointmentId(tokenData.appointment_id);
    if (ratingExists) {
      throw new ConflictError('This appointment has already been rated');
    }

    // Create rating
    const ratingData = await ratingRepository.create({
      appointment_id: tokenData.appointment_id,
      mechanic_id: tokenData.mechanic_id,
      rating: rating,
      comments: comments || null,
      client_id: null // Could be extracted from appointment if needed
    });

    // Mark token as used
    await ratingTokenRepository.markAsUsed(tokenData.id);

    return {
      message: "Calificación enviada exitosamente",
      ratingId: ratingData.id
    };
  }

  /**
   * Get average rating for mechanic
   */
  async getAverageByMechanicId(mechanicId) {
    return await ratingRepository.getAverageByMechanicId(mechanicId);
  }
}

module.exports = new RatingService();

