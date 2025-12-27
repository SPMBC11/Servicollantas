const clientService = require('../../services/clientService');
const clientRepository = require('../../repositories/clientRepository');

jest.mock('../../repositories/clientRepository');

describe('ClientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create client successfully', async () => {
      const clientData = {
        name: 'John Doe',
        phone: '123456789',
        email: 'john@example.com'
      };

      const createdClient = {
        id: '1',
        ...clientData,
        created_at: new Date()
      };

      clientRepository.create.mockResolvedValue(createdClient);

      const result = await clientService.createClient(clientData);

      expect(result).toEqual(createdClient);
      expect(clientRepository.create).toHaveBeenCalledWith(clientData);
    });

    it('should throw error if client email already exists', async () => {
      const clientData = {
        name: 'John Doe',
        phone: '123456789',
        email: 'existing@example.com'
      };

      clientRepository.create.mockRejectedValue(
        new Error('Email already exists')
      );

      await expect(clientService.createClient(clientData))
        .rejects
        .toThrow('Email already exists');
    });
  });

  describe('getClientById', () => {
    it('should return client by id', async () => {
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      };

      clientRepository.findById.mockResolvedValue(client);

      const result = await clientService.getClientById('1');

      expect(result).toEqual(client);
      expect(clientRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error if client not found', async () => {
      clientRepository.findById.mockResolvedValue(null);

      await expect(clientService.getClientById('nonexistent'))
        .rejects
        .toThrow();
    });
  });

  describe('getAllClients', () => {
    it('should return all clients', async () => {
      const clients = [
        { id: '1', name: 'Client 1', email: 'client1@example.com' },
        { id: '2', name: 'Client 2', email: 'client2@example.com' }
      ];

      clientRepository.findAll.mockResolvedValue(clients);

      const result = await clientService.getAllClients();

      expect(result).toEqual(clients);
      expect(clientRepository.findAll).toHaveBeenCalled();
    });
  });
});
