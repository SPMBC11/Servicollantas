// Vehicle Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const vehicleService = require('../services/vehicleService');
const httpStatus = require('../constants/httpStatus');

const getAll = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAll();
  return successResponse(res, vehicles);
});

const getById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getById(req.params.id);
  return successResponse(res, vehicle);
});

const getByClientId = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getByClientId(req.params.clientId);
  return successResponse(res, vehicles);
});

const create = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.create(req.body, req.user);
  return successResponse(res, vehicle, httpStatus.CREATED);
});

const update = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.update(req.params.id, req.body);
  return successResponse(res, vehicle);
});

const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.delete(req.params.id);
  return successResponse(res, null, httpStatus.NO_CONTENT);
});

module.exports = {
  getAll,
  getById,
  getByClientId,
  create,
  update,
  delete: deleteVehicle
};

