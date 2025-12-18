// Invoice Controller
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/response');
const invoiceService = require('../services/invoiceService');
const httpStatus = require('../constants/httpStatus');
const PDFDocument = require('pdfkit');
const invoiceRepository = require('../repositories/invoiceRepository');

const getAll = asyncHandler(async (req, res) => {
  const invoices = await invoiceService.getAll();
  return successResponse(res, invoices);
});

const getById = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getById(req.params.id);
  return successResponse(res, invoice);
});

const create = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.create(req.body);
  return successResponse(res, invoice, httpStatus.CREATED);
});

const generateFromAppointment = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.generateFromAppointment(req.params.appointmentId);
  return successResponse(res, invoice, httpStatus.CREATED);
});

const downloadPDF = asyncHandler(async (req, res) => {
  const invoice = await invoiceRepository.findById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ success: false, error: { message: 'Invoice not found' } });
  }

  // Generate PDF
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const filename = `factura-${invoice.id}.pdf`;
  res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-type", "application/pdf");
  
  doc.pipe(res);
  
  // Header
  doc.fontSize(20).text("SERVI-COLLANTAS", { align: "center" });
  doc.moveDown(0.2);
  doc.fontSize(14).text("Factura Electrónica", { align: "center" });
  doc.moveDown(1);
  
  doc.fontSize(12).text(`Factura N°: ${invoice.id}`);
  doc.text(`Fecha: ${new Date(invoice.date).toLocaleString()}`);
  doc.moveDown(0.5);
  
  doc.text(`Cliente: ${invoice.client_name}`);
  doc.text(`Email: ${invoice.client_email}`);
  doc.text(`Vehículo: ${invoice.vehicle_info}`);
  doc.moveDown(1);
  
  // Table header
  doc.font("Helvetica-Bold");
  doc.text("Servicio", { continued: true, width: 400 });
  doc.text("Precio", { align: "right" });
  doc.font("Helvetica");
  doc.moveDown(0.5);
  
  const services = typeof invoice.services === 'string' ? JSON.parse(invoice.services) : invoice.services;
  services.forEach(s => {
    doc.text(s.name, { continued: true, width: 400 });
    doc.text(`$${Number(s.price).toFixed(2)}`, { align: "right" });
  });
  
  doc.moveDown(1);
  doc.font("Helvetica-Bold");
  doc.text("Total", { continued: true, width: 400 });
  doc.text(`$${Number(invoice.total).toFixed(2)}`, { align: "right" });
  
  doc.moveDown(2);
  doc.fontSize(10).text("Gracias por su preferencia.", { align: "center" });
  
  doc.end();
});

const deleteInvoice = asyncHandler(async (req, res) => {
  await invoiceService.delete(req.params.id);
  return successResponse(res, null, httpStatus.NO_CONTENT);
});

module.exports = {
  getAll,
  getById,
  create,
  generateFromAppointment,
  downloadPDF,
  delete: deleteInvoice
};

