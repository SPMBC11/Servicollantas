// Centralized Error Handler Middleware
const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');
const AppError = require('../errors/AppError');
const httpStatus = require('../constants/httpStatus');

/**
 * Global error handler middleware
 * Must be used after all routes
 */
function errorHandler(err, req, res, next) {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  // If error is an AppError (operational error), use its status code
  if (err instanceof AppError) {
    return errorResponse(
      res,
      {
        message: err.message,
        ...(err.details && { details: err.details }),
        ...(err.field && { field: err.field })
      },
      err.statusCode,
      err.code
    );
  }

  // Handle database errors
  if (err.code === '23505') { // Unique violation
    return errorResponse(
      res,
      'Resource already exists',
      httpStatus.CONFLICT,
      'CONFLICT'
    );
  }

  if (err.code === '23503') { // Foreign key violation
    return errorResponse(
      res,
      'Invalid reference to related resource',
      httpStatus.BAD_REQUEST,
      'INVALID_REFERENCE'
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(
      res,
      'Invalid token',
      httpStatus.UNAUTHORIZED,
      'INVALID_TOKEN'
    );
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(
      res,
      'Token expired',
      httpStatus.UNAUTHORIZED,
      'TOKEN_EXPIRED'
    );
  }

  // Default: Internal server error
  // Don't expose error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  return errorResponse(
    res,
    message,
    httpStatus.INTERNAL_SERVER_ERROR,
    'INTERNAL_SERVER_ERROR'
  );
}

module.exports = errorHandler;

