// Conflict Error Class
const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');

class ConflictError extends AppError {
  constructor(message = 'Resource conflict', field = null) {
    super(message, httpStatus.CONFLICT, 'CONFLICT');
    this.field = field;
  }
}

module.exports = ConflictError;

