// Auth Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginRules } = require('../validators/authValidator');
const validate = require('../middlewares/validate');

router.post('/login', loginRules, validate, authController.login);

module.exports = router;

