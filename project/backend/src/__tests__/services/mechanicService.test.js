const mechanicService = require('../../services/mechanicService');
const mechanicRepository = require('../../repositories/mechanicRepository');

jest.mock('../../repositories/mechanicRepository');

describe('MechanicService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMechanic', () => {
    it('should create mechanic successfully', async () => {
      const mechanicData = {
        name: 'John Mechanic',
        email: 'john@mechanic.com',
        phone: '123456789'
      };

      const createdMechanic = {
        id: '1',
        ...mechanicData,
        status: 'active'
      };

      mechanicRepository.create.mockResolvedValue(createdMechanic);

      const result = await mechanicService.createMechanic(mechanicData);

      expect(result).toEqual(createdMechanic);
    });
  });

  describe('getMechanicStats', () => {
    it('should return mechanic statistics', async () => {
      const stats = {
        id: '1',
        total_appointments: 50,
        completed_appointments: 45,
        average_rating: 4.8,
        completion_rate: 0.9
      };

      mechanicRepository.getStats.mockResolvedValue(stats);

      const result = await mechanicService.getMechanicStats('1');

      expect(result).toEqual(stats);
      expect(result.completion_rate).toBe(0.9);
    });
  });

  describe('getMechanicsByStatus', () => {
    it('should return active mechanics', async () => {
      const mechanics = [
        { id: '1', name: 'Mechanic 1', status: 'active' },
        { id: '2', name: 'Mechanic 2', status: 'active' }
      ];

      mechanicRepository.findByStatus.mockResolvedValue(mechanics);

      const result = await mechanicService.getMechanicsByStatus('active');

      expect(result).toHaveLength(2);
      expect(result.every(m => m.status === 'active')).toBe(true);
    });
  });
});
