const appointmentService = require('../../services/appointmentService');
const appointmentRepository = require('../../repositories/appointmentRepository');
const invoiceService = require('../../services/invoiceService');

jest.mock('../../repositories/appointmentRepository');
jest.mock('../../services/invoiceService');

describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      const appointmentData = {
        client_id: '1',
        vehicle_id: '1',
        service_id: '1',
        date: '2025-12-25',
        time: '10:00'
      };

      const createdAppointment = {
        id: '1',
        ...appointmentData,
        status: 'pending'
      };

      appointmentRepository.create.mockResolvedValue(createdAppointment);

      const result = await appointmentService.createAppointment(appointmentData);

      expect(result).toEqual(createdAppointment);
      expect(appointmentRepository.create).toHaveBeenCalledWith(appointmentData);
    });
  });

  describe('completeAppointment', () => {
    it('should complete appointment and generate invoice', async () => {
      const appointment = {
        id: '1',
        client_id: '1',
        status: 'pending',
        service_id: '1'
      };

      appointmentRepository.findById.mockResolvedValue(appointment);
      appointmentRepository.update.mockResolvedValue({ ...appointment, status: 'completed' });
      invoiceService.generateInvoice.mockResolvedValue({ id: 'invoice-1' });

      await appointmentService.completeAppointment('1');

      expect(appointmentRepository.update).toHaveBeenCalled();
      expect(invoiceService.generateInvoice).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1' })
      );
    });
  });

  describe('getAppointmentsByClientId', () => {
    it('should return appointments for client', async () => {
      const appointments = [
        { id: '1', client_id: '1', status: 'completed' },
        { id: '2', client_id: '1', status: 'pending' }
      ];

      appointmentRepository.findByClientId.mockResolvedValue(appointments);

      const result = await appointmentService.getAppointmentsByClientId('1');

      expect(result).toEqual(appointments);
    });
  });
});
