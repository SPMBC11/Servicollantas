// Client Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const clientService = require('../services/clientService');
const httpStatus = require('../constants/httpStatus');

const getAll = asyncHandler(async (req, res) => {
  const clients = await clientService.getAll();
  return successResponse(res, clients);
});

const getById = asyncHandler(async (req, res) => {
  const client = await clientService.getById(req.params.id);
  return successResponse(res, client);
});

const create = asyncHandler(async (req, res) => {
  const client = await clientService.create(req.body);
  return successResponse(res, client, httpStatus.CREATED);
});

const update = asyncHandler(async (req, res) => {
  const client = await clientService.update(req.params.id, req.body);
  return successResponse(res, client);
});

const deleteClient = asyncHandler(async (req, res) => {
  await clientService.delete(req.params.id);
  return successResponse(res, null, httpStatus.NO_CONTENT);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteClient
};

