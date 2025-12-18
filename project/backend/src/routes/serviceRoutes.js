// Service Routes
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middlewares/auth');
const { createServiceRules, updateServiceRules } = require('../validators/serviceValidator');
const validate = require('../middlewares/validate');
const roles = require('../constants/roles');

// Get all services (public - anyone can see services)
router.get('/', serviceController.getAll);

// Get service by ID (public)
router.get('/:id', serviceController.getById);

// Create service (admin only)
router.post(
  '/',
  authenticate,
  authorize([roles.ADMIN]),
  createServiceRules,
  validate,
  serviceController.create
);

// Update service (admin only)
router.put(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  updateServiceRules,
  validate,
  serviceController.update
);

// Delete service (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  serviceController.delete
);

module.exports = router;

