// Ownership Verification Middleware
// Ensures users can only access their own resources (unless admin)
const { pool } = require('../database');
const { forbiddenResponse } = require('../utils/response');
const ForbiddenError = require('../errors/ForbiddenError');
const roles = require('../constants/roles');

/**
 * Check if user owns a client resource
 * Admin can access any client
 */
async function checkClientOwnership(req, res, next) {
  try {
    // Admin can access any resource
    if (req.user.role === roles.ADMIN) {
      return next();
    }

    const clientId = req.params.id || req.body.client_id || req.query.client_id;
    
    if (!clientId) {
      return next();
    }

    // Client can only access their own data
    if (req.user.role === roles.CLIENT && req.user.id !== clientId) {
      throw new ForbiddenError('You can only access your own data');
    }

    // Mechanic can access client data (for appointments)
    if (req.user.role === roles.MECHANIC) {
      // Allow mechanics to access client data
      return next();
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Check if user owns a vehicle resource
 */
async function checkVehicleOwnership(req, res, next) {
  try {
    if (req.user.role === roles.ADMIN || req.user.role === roles.MECHANIC) {
      return next();
    }

    const vehicleId = req.params.id || req.body.vehicle_id;
    
    if (!vehicleId) {
      return next();
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT client_id FROM vehicles WHERE id = $1',
        [vehicleId]
      );
      client.release();

      if (result.rows.length === 0) {
        return next(); // Let NotFoundError handle this
      }

      if (result.rows[0].client_id !== req.user.id) {
        throw new ForbiddenError('You can only access your own vehicles');
      }

      next();
    } catch (err) {
      client.release();
      throw err;
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Check if user owns an appointment resource
 */
async function checkAppointmentOwnership(req, res, next) {
  try {
    if (req.user.role === roles.ADMIN) {
      return next();
    }

    const appointmentId = req.params.id || req.body.appointment_id;
    
    if (!appointmentId) {
      return next();
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT client_id, service_provider_id FROM appointments WHERE id = $1',
        [appointmentId]
      );
      client.release();

      if (result.rows.length === 0) {
        return next(); // Let NotFoundError handle this
      }

      const appointment = result.rows[0];

      // Client can access their own appointments
      if (req.user.role === roles.CLIENT && appointment.client_id === req.user.id) {
        return next();
      }

      // Mechanic can access their assigned appointments
      if (req.user.role === roles.MECHANIC && appointment.service_provider_id === req.user.id) {
        return next();
      }

      throw new ForbiddenError('You can only access your own appointments');
    } catch (err) {
      client.release();
      throw err;
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Check if user owns a mechanic profile
 */
async function checkMechanicOwnership(req, res, next) {
  try {
    if (req.user.role === roles.ADMIN) {
      return next();
    }

    const mechanicId = req.params.id || req.user.id;

    if (req.user.role === roles.MECHANIC && req.user.id !== mechanicId) {
      throw new ForbiddenError('You can only access your own profile');
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkClientOwnership,
  checkVehicleOwnership,
  checkAppointmentOwnership,
  checkMechanicOwnership
};

