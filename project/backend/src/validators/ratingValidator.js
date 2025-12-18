// Rating Validation Rules
const { body, param } = require('express-validator');

const submitRatingRules = [
  body('token')
    .notEmpty().withMessage('Rating token is required')
    .isUUID().withMessage('Rating token must be a valid UUID'),
  
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('comments')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Comments must not exceed 1000 characters')
];

const generateLinkRules = [
  body('appointment_id')
    .notEmpty().withMessage('Appointment ID is required')
    .isUUID().withMessage('Appointment ID must be a valid UUID')
];

const getByTokenRules = [
  param('token')
    .notEmpty().withMessage('Rating token is required')
    .isUUID().withMessage('Rating token must be a valid UUID')
];

module.exports = {
  submitRatingRules,
  generateLinkRules,
  getByTokenRules
};

