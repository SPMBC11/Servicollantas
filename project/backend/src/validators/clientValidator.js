// Client Validation Rules
const { body } = require('express-validator');

const createClientRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be between 10 and 20 characters')
];

const updateClientRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .trim()
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .notEmpty().withMessage('Phone cannot be empty')
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be between 10 and 20 characters')
];

module.exports = {
  createClientRules,
  updateClientRules
};

