// Mechanic Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const mechanicService = require('../services/mechanicService');
const httpStatus = require('../constants/httpStatus');

const getAll = asyncHandler(async (req, res) => {
  const mechanics = await mechanicService.getAll();
  return successResponse(res, mechanics);
});

const getAvailable = asyncHandler(async (req, res) => {
  const mechanics = await mechanicService.getAvailable();
  return successResponse(res, mechanics);
});

const getById = asyncHandler(async (req, res) => {
  const mechanic = await mechanicService.getById(req.params.id);
  return successResponse(res, mechanic);
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await mechanicService.getProfile(req.user.id);
  return successResponse(res, profile);
});

const create = asyncHandler(async (req, res) => {
  const result = await mechanicService.create(req.body);
  return successResponse(res, result, httpStatus.CREATED);
});

const update = asyncHandler(async (req, res) => {
  const mechanic = await mechanicService.update(req.params.id, req.body);
  return successResponse(res, mechanic);
});

const regeneratePassword = asyncHandler(async (req, res) => {
  const result = await mechanicService.regeneratePassword(req.body.id);
  return successResponse(res, result);
});

const updateProfile = asyncHandler(async (req, res) => {
  const mechanic = await mechanicService.updateProfile(req.user.id, req.body);
  return successResponse(res, mechanic);
});

const deleteMechanic = asyncHandler(async (req, res) => {
  await mechanicService.delete(req.params.id);
  return successResponse(res, null, httpStatus.NO_CONTENT);
});

module.exports = {
  getAll,
  getAvailable,
  getById,
  getProfile,
  create,
  update,
  regeneratePassword,
  updateProfile,
  delete: deleteMechanic
};

