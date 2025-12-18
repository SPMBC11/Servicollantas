// Unauthorized Error Class
const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, httpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

module.exports = UnauthorizedError;

