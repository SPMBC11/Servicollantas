// Appointment Routes
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkAppointmentOwnership } = require('../middlewares/ownership');
const { createAppointmentRules, updateAppointmentRules } = require('../validators/appointmentValidator');
const validate = require('../middlewares/validate');
const roles = require('../constants/roles');

// Get all appointments (admin, mechanic)
router.get(
  '/',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC]),
  appointmentController.getAll
);

// Get appointments by mechanic ID
router.get(
  '/mechanic/:mechanicId',
  authenticate,
  appointmentController.getByMechanicId
);

// Get appointment by ID
router.get(
  '/:id',
  authenticate,
  appointmentController.getById
);

// Create appointment (any authenticated user)
router.post(
  '/',
  authenticate,
  createAppointmentRules,
  validate,
  appointmentController.create
);

// Update appointment
router.put(
  '/:id',
  authenticate,
  authorize([roles.ADMIN, roles.MECHANIC]),
  checkAppointmentOwnership,
  updateAppointmentRules,
  validate,
  appointmentController.update
);

// Delete appointment
router.delete(
  '/:id',
  authenticate,
  authorize([roles.ADMIN, roles.CLIENT]),
  checkAppointmentOwnership,
  appointmentController.delete
);

module.exports = router;

