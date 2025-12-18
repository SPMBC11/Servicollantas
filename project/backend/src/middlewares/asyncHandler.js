// Async Handler Wrapper
// Eliminates need for try/catch in every route handler

/**
 * Wraps async route handlers to automatically catch errors
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;

