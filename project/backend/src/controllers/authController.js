// Auth Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const authService = require('../services/authService');
const httpStatus = require('../constants/httpStatus');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return successResponse(res, result, httpStatus.OK);
});

module.exports = {
  login
};

