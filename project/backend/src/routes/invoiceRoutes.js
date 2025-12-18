// Invoice Routes
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middlewares/auth');
const { createInvoiceRules } = require('../validators/invoiceValidator');
const validate = require('../middlewares/validate');
const roles = require('../constants/roles');

// Get all invoices (admin only)
router.get(
  '/',
  authenticate,
  authorize([roles.ADMIN]),
  invoiceController.getAll
);

// Get invoice by ID (admin only)
router.get(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  invoiceController.getById
);

// Create invoice (admin only)
router.post(
  '/',
  authenticate,
  authorize([roles.ADMIN]),
  createInvoiceRules,
  validate,
  invoiceController.create
);

// Generate invoice from appointment (admin only)
router.post(
  '/from-appointment/:appointmentId',
  authenticate,
  authorize([roles.ADMIN]),
  invoiceController.generateFromAppointment
);

// Download invoice PDF (admin only)
router.get(
  '/:id/pdf',
  authenticate,
  authorize([roles.ADMIN]),
  invoiceController.downloadPDF
);

// Delete invoice (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize([roles.ADMIN]),
  invoiceController.delete
);

module.exports = router;

