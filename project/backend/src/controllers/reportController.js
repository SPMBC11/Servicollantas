// Report Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const reportService = require('../services/reportService');

const getReports = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const reportData = await reportService.generateReport(startDate, endDate);
  return successResponse(res, reportData);
});

module.exports = {
  getReports
};

