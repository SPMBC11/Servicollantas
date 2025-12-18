// Vehicle Validation Rules
const { body } = require('express-validator');

const createVehicleRules = [
  body('make')
    .trim()
    .notEmpty().withMessage('Make is required')
    .isLength({ min: 1, max: 50 }).withMessage('Make must be between 1 and 50 characters'),
  
  body('model')
    .trim()
    .notEmpty().withMessage('Model is required')
    .isLength({ min: 1, max: 50 }).withMessage('Model must be between 1 and 50 characters'),
  
  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
  
  body('license_plate')
    .trim()
    .notEmpty().withMessage('License plate is required')
    .isLength({ min: 4, max: 20 }).withMessage('License plate must be between 4 and 20 characters')
    .matches(/^[A-Z0-9-]+$/i).withMessage('License plate contains invalid characters'),
  
  body('client_id')
    .notEmpty().withMessage('Client ID is required')
    .isUUID().withMessage('Client ID must be a valid UUID')
];

const updateVehicleRules = [
  body('make')
    .optional()
    .trim()
    .notEmpty().withMessage('Make cannot be empty')
    .isLength({ min: 1, max: 50 }).withMessage('Make must be between 1 and 50 characters'),
  
  body('model')
    .optional()
    .trim()
    .notEmpty().withMessage('Model cannot be empty')
    .isLength({ min: 1, max: 50 }).withMessage('Model must be between 1 and 50 characters'),
  
  body('year')
    .optional()
    .notEmpty().withMessage('Year cannot be empty')
    .isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
  
  body('license_plate')
    .optional()
    .trim()
    .notEmpty().withMessage('License plate cannot be empty')
    .isLength({ min: 4, max: 20 }).withMessage('License plate must be between 4 and 20 characters')
    .matches(/^[A-Z0-9-]+$/i).withMessage('License plate contains invalid characters'),
  
  body('client_id')
    .optional()
    .notEmpty().withMessage('Client ID cannot be empty')
    .isUUID().withMessage('Client ID must be a valid UUID')
];

module.exports = {
  createVehicleRules,
  updateVehicleRules
};

