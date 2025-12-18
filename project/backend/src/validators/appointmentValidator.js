// Appointment Validation Rules
const { body } = require('express-validator');

const createAppointmentRules = [
  body('client_id')
    .notEmpty().withMessage('Client ID is required')
    .isUUID().withMessage('Client ID must be a valid UUID'),
  
  body('vehicle_id')
    .notEmpty().withMessage('Vehicle ID is required')
    .isUUID().withMessage('Vehicle ID must be a valid UUID'),
  
  body('service_id')
    .notEmpty().withMessage('Service ID is required')
    .isUUID().withMessage('Service ID must be a valid UUID'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Date cannot be in the past');
      }
      return true;
    }),
  
  body('time')
    .notEmpty().withMessage('Time is required')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:mm format (24-hour)'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters'),
  
  body('service_provider_id')
    .optional()
    .isUUID().withMessage('Service provider ID must be a valid UUID')
];

const updateAppointmentRules = [
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled']).withMessage('Status must be one of: pending, completed, cancelled'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters'),
  
  body('service_provider_id')
    .optional()
    .isUUID().withMessage('Service provider ID must be a valid UUID')
];

module.exports = {
  createAppointmentRules,
  updateAppointmentRules
};

