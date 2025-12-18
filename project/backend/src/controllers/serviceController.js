// Service Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const serviceService = require('../services/serviceService');
const httpStatus = require('../constants/httpStatus');

const getAll = asyncHandler(async (req, res) => {
  const services = await serviceService.getAll();
  return successResponse(res, services);
});

const getById = asyncHandler(async (req, res) => {
  const service = await serviceService.getById(req.params.id);
  return successResponse(res, service);
});

const create = asyncHandler(async (req, res) => {
  const service = await serviceService.create(req.body);
  return successResponse(res, service, httpStatus.CREATED);
});

const update = asyncHandler(async (req, res) => {
  const service = await serviceService.update(req.params.id, req.body);
  return successResponse(res, service);
});

const deleteService = asyncHandler(async (req, res) => {
  await serviceService.delete(req.params.id);
  return successResponse(res, null, httpStatus.NO_CONTENT);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteService
};

