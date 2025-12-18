// Report Routes
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middlewares/auth');
const roles = require('../constants/roles');

// Get reports (admin only)
router.get(
  '/',
  authenticate,
  authorize([roles.ADMIN]),
  reportController.getReports
);

module.exports = router;

