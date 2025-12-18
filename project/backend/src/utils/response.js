// Standardized Response Utilities
const httpStatus = require('../constants/httpStatus');

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {any} data - Data to send
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function successResponse(res, data, statusCode = httpStatus.OK) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string|Object} error - Error message or error object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} code - Error code (optional)
 */
function errorResponse(res, error, statusCode = httpStatus.BAD_REQUEST, code = null) {
  const errorObj = typeof error === 'string' 
    ? { message: error }
    : error;

  return res.status(statusCode).json({
    success: false,
    error: {
      code: code || getErrorCode(statusCode),
      message: errorObj.message || 'An error occurred',
      ...(errorObj.details && { details: errorObj.details })
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name (e.g., "Client", "Appointment")
 */
function notFoundResponse(res, resource = 'Resource') {
  return errorResponse(
    res,
    `${resource} not found`,
    httpStatus.NOT_FOUND,
    'NOT_FOUND'
  );
}

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (optional)
 */
function unauthorizedResponse(res, message = 'Unauthorized') {
  return errorResponse(
    res,
    message,
    httpStatus.UNAUTHORIZED,
    'UNAUTHORIZED'
  );
}

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (optional)
 */
function forbiddenResponse(res, message = 'Forbidden') {
  return errorResponse(
    res,
    message,
    httpStatus.FORBIDDEN,
    'FORBIDDEN'
  );
}

/**
 * Get error code from status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error code
 */
function getErrorCode(statusCode) {
  const codes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    500: 'INTERNAL_SERVER_ERROR',
    503: 'SERVICE_UNAVAILABLE'
  };
  return codes[statusCode] || 'UNKNOWN_ERROR';
}

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse
};

