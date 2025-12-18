// Authentication and Authorization Middlewares
const jwt = require('jsonwebtoken');
const config = require('../config');
const { unauthorizedResponse, forbiddenResponse } = require('../utils/response');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const roles = require('../constants/roles');

/**
 * Authenticate user (verify JWT token)
 * Adds req.user with user data if token is valid
 */
function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    
    if (!auth) {
      throw new UnauthorizedError('Missing auth token');
    }

    const token = auth.replace('Bearer ', '');
    
    try {
      const payload = jwt.verify(token, config.server.jwtSecret);
      req.user = payload;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired');
      }
      throw new UnauthorizedError('Invalid token');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Authorize user by role(s)
 * Must be used after authenticate middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Check if user is admin
 */
function requireAdmin(req, res, next) {
  return authorize([roles.ADMIN])(req, res, next);
}

/**
 * Check if user is mechanic
 */
function requireMechanic(req, res, next) {
  return authorize([roles.MECHANIC])(req, res, next);
}

/**
 * Check if user is client
 */
function requireClient(req, res, next) {
  return authorize([roles.CLIENT])(req, res, next);
}

/**
 * Check if user is admin or mechanic
 */
function requireAdminOrMechanic(req, res, next) {
  return authorize([roles.ADMIN, roles.MECHANIC])(req, res, next);
}

module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  requireMechanic,
  requireClient,
  requireAdminOrMechanic
};

