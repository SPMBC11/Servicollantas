// Rating Routes
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middlewares/auth');
const { generateLinkRules, getByTokenRules, submitRatingRules } = require('../validators/ratingValidator');
const validate = require('../middlewares/validate');
const roles = require('../constants/roles');

// Generate rating link (admin only)
router.post(
  '/generate-link',
  authenticate,
  authorize([roles.ADMIN]),
  generateLinkRules,
  validate,
  ratingController.generateLink
);

// Get token info (public - for rating form)
router.get(
  '/token/:token',
  getByTokenRules,
  validate,
  ratingController.getTokenInfo
);

// Submit rating (public - with token)
router.post(
  '/submit',
  submitRatingRules,
  validate,
  ratingController.submit
);

module.exports = router;

