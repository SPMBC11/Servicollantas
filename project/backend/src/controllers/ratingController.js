// Rating Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const ratingService = require('../services/ratingService');

const generateLink = asyncHandler(async (req, res) => {
  const result = await ratingService.generateLink(req.body.appointment_id);
  return successResponse(res, result);
});

const getTokenInfo = asyncHandler(async (req, res) => {
  const info = await ratingService.getTokenInfo(req.params.token);
  return successResponse(res, info);
});

const submit = asyncHandler(async (req, res) => {
  const result = await ratingService.submit(req.body);
  return successResponse(res, result);
});

module.exports = {
  generateLink,
  getTokenInfo,
  submit
};

