// Service Validation Rules
const { body } = require('express-validator');

const createServiceRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Service name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Service name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer (in minutes)')
];

const updateServiceRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Service name cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Service name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .optional()
    .notEmpty().withMessage('Price cannot be empty')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('duration')
    .optional()
    .notEmpty().withMessage('Duration cannot be empty')
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer (in minutes)')
];

module.exports = {
  createServiceRules,
  updateServiceRules
};

