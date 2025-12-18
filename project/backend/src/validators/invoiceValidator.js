// Invoice Validation Rules
const { body } = require('express-validator');

const createInvoiceRules = [
  body('client_name')
    .trim()
    .notEmpty().withMessage('Client name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Client name must be between 2 and 100 characters'),
  
  body('client_email')
    .trim()
    .notEmpty().withMessage('Client email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('vehicle_info')
    .trim()
    .notEmpty().withMessage('Vehicle information is required')
    .isLength({ max: 200 }).withMessage('Vehicle information must not exceed 200 characters'),
  
  body('services')
    .isArray({ min: 1 }).withMessage('At least one service is required')
    .custom((services) => {
      if (!Array.isArray(services) || services.length === 0) {
        throw new Error('Services array cannot be empty');
      }
      for (const service of services) {
        if (!service.id || !service.name || typeof service.price !== 'number' || service.price < 0) {
          throw new Error('Each service must have id, name, and valid price');
        }
      }
      return true;
    }),
  
  body('total')
    .notEmpty().withMessage('Total is required')
    .isFloat({ min: 0 }).withMessage('Total must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['pending', 'paid']).withMessage('Status must be pending or paid')
];

module.exports = {
  createInvoiceRules
};

