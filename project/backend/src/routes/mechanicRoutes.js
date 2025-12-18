// Mechanic Routes
const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkMechanicOwnership } = require('../middlewares/ownership');
const { createMechanicRules, updateMechanicRules, updateMechanicProfileRules } = require('../validators/mechanicValidator');
const validate = require('../middlewares/validate');
const roles = require('../constants/roles');

// Get available mechanics (public - for client selection)
router.get('/available', mechanicController.getAvailable);

// Get mechanic profile (mechanic only)
router.get(
  '/profile',
  authenticate,
  authorize([roles.MECHANIC]),
  mechanicController.getProfile
);

// Get all mechanics with stats (admin only)
router.get(
  '/',
  authenticate,
  authorize([roles.ADMIN]),
  mechanicController.getAll
);

// Get mechanic by ID
router.get(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  mechanicController.getById
);

// Create mechanic (admin only)
router.post(
  '/',
  authenticate,
  authorize([roles.ADMIN]),
  createMechanicRules,
  validate,
  mechanicController.create
);

// Update mechanic (admin only)
router.put(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  updateMechanicRules,
  validate,
  mechanicController.update
);

// Regenerate password (admin only)
router.post(
  '/regenerate-password',
  authenticate,
  authorize([roles.ADMIN]),
  mechanicController.regeneratePassword
);

// Update mechanic profile (mechanic only - name and password)
router.put(
  '/profile/update',
  authenticate,
  authorize([roles.MECHANIC]),
  updateMechanicProfileRules,
  validate,
  mechanicController.updateProfile
);

// Delete mechanic (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  mechanicController.delete
);

module.exports = router;

