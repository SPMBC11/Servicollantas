const {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse
} = require('../../utils/response');
const httpStatus = require('../../constants/httpStatus');

describe('Response Utilities', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('successResponse', () => {
    it('should return 200 status with data by default', () => {
      const data = { id: '1', name: 'Test' };
      successResponse(mockRes, data);

      expect(mockRes.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
        timestamp: expect.any(String)
      });
    });

    it('should return custom status code', () => {
      const data = { id: '1' };
      successResponse(mockRes, data, 201);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('errorResponse', () => {
    it('should return error with default status', () => {
      const error = new Error('Test error');
      errorResponse(mockRes, error);

      expect(mockRes.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Test error'
        })
      );
    });

    it('should return error with custom status', () => {
      const error = new Error('Server error');
      errorResponse(mockRes, error, 500);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('notFoundResponse', () => {
    it('should return 404 not found', () => {
      notFoundResponse(mockRes, 'User');

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('User')
        })
      );
    });
  });

  describe('unauthorizedResponse', () => {
    it('should return 401 unauthorized', () => {
      unauthorizedResponse(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('forbiddenResponse', () => {
    it('should return 403 forbidden', () => {
      forbiddenResponse(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });
});
