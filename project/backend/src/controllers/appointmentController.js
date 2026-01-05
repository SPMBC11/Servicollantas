// Appointment Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const appointmentService = require('../services/appointmentService');
const httpStatus = require('../constants/httpStatus');

const getAll = asyncHandler(async (req, res) => {
  console.log("🔍 Admin/Mecánico solicitando todas las citas...");
  const appointments = await appointmentService.getAll();
  console.log(`✅ Citas encontradas en DB: ${appointments ? appointments.length : 0}`);
  return successResponse(res, appointments);
});

const getById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getById(req.params.id);
  return successResponse(res, appointment);
});

const getByMechanicId = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getByMechanicId(req.params.mechanicId);
  return successResponse(res, appointments);
});

const create = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.create(req.body, req.user);
  return successResponse(res, appointment, httpStatus.CREATED);
});

const update = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.update(req.params.id, req.body);
  return successResponse(res, appointment);
});

const deleteAppointment = asyncHandler(async (req, res) => {
  await appointmentService.delete(req.params.id);
  return successResponse(res, null, httpStatus.NO_CONTENT);
});

module.exports = {
  getAll,
  getById,
  getByMechanicId,
  create,
  update,
  delete: deleteAppointment
};
