// Validation Error Class
const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, httpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
    this.details = details;
  }
}

module.exports = ValidationError;

