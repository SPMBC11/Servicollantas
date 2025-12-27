const authService = require('../../services/authService');
const userRepository = require('../../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user successfully with correct credentials', async () => {
      const email = 'test@test.com';
      const password = 'password123';
      const user = {
        id: '1',
        email,
        password_hash: 'hashed_password',
        role: 'admin',
        name: 'Test User'
      };

      userRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('token123');

      const result = await authService.login(email, password);

      expect(result).toEqual({
        token: 'token123',
        user: expect.objectContaining({ email, role: 'admin' })
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw error for invalid email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('invalid@test.com', 'password'))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password_hash: 'hashed_password',
        role: 'admin'
      };

      userRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compareSync.mockReturnValue(false);

      await expect(authService.login('test@test.com', 'wrongpassword'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        name: 'New User',
        role: 'client'
      };

      bcrypt.hashSync.mockReturnValue('hashed_password');
      userRepository.create.mockResolvedValue({
        id: '1',
        ...userData
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty('id');
      expect(userRepository.create).toHaveBeenCalled();
    });
  });
});
