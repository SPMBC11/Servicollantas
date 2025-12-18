// Not Found Error Class
const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, httpStatus.NOT_FOUND, 'NOT_FOUND');
    this.resource = resource;
  }
}

module.exports = NotFoundError;

