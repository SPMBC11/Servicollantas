// Validation Middleware
const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');

/**
 * Middleware to check validation results
 * Must be used after validation rules
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      {
        message: 'Validation failed',
        details: errors.array()
      },
      httpStatus.BAD_REQUEST,
      'VALIDATION_ERROR'
    );
  }
  
  next();
}

module.exports = validate;

