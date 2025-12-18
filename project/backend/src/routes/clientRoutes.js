// Client Routes
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkClientOwnership } = require('../middlewares/ownership');
const { createClientRules, updateClientRules } = require('../validators/clientValidator');
const validate = require('../middlewares/validate');
const roles = require('../constants/roles');

// Get all clients (admin, mechanic)
router.get(
  '/',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC]),
  clientController.getAll
);

// Get client by ID
router.get(
  '/:id',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC, roles.CLIENT]),
  checkClientOwnership,
  clientController.getById
);

// Create client (admin, mechanic)
router.post(
  '/',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC]),
  createClientRules,
  validate,
  clientController.create
);

// Update client
router.put(
  '/:id',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC, roles.CLIENT]),
  checkClientOwnership,
  updateClientRules,
  validate,
  clientController.update
);

// Delete client (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  clientController.delete
);

module.exports = router;

