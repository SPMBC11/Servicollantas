// Vehicle Routes
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkVehicleOwnership } = require('../middlewares/ownership');
const { createVehicleRules, updateVehicleRules } = require('../validators/vehicleValidator');
const validate = require('../middlewares/validate');
const roles = require('../constants/roles');

// Get all vehicles (admin, mechanic)
router.get(
  '/',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC]),
  vehicleController.getAll
);

// Get vehicles by client ID
router.get(
  '/client/:clientId',
  authenticate,
  vehicleController.getByClientId
);

// Get vehicle by ID
router.get(
  '/:id',
  authenticate,
  vehicleController.getById
);

// Create vehicle (any authenticated user)
router.post(
  '/',
  authenticate,
  createVehicleRules,
  validate,
  vehicleController.create
);

// Update vehicle
router.put(
  '/:id',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC, roles.CLIENT]),
  checkVehicleOwnership,
  updateVehicleRules,
  validate,
  vehicleController.update
);

// Delete vehicle
router.delete(
  '/:id',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC, roles.CLIENT]),
  checkVehicleOwnership,
  vehicleController.delete
);

module.exports = router;

