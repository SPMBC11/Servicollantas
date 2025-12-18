// Forbidden Error Class
const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, httpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

module.exports = ForbiddenError;

