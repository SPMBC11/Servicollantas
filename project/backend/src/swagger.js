const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ServiCollantas API',
      version: '1.0.0',
      description: 'API para gestión de talleres automotrices (Servitecas)',
      contact: {
        name: 'ServiCollantas Support',
        email: 'support@servicollantas.com'
      },
      license: {
        name: 'MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.servicollantas.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'mechanic', 'client'] },
            name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            license_plate: { type: 'string' },
            client_id: { type: 'string' }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            client_id: { type: 'string' },
            vehicle_id: { type: 'string' },
            service_id: { type: 'string' },
            date: { type: 'string', format: 'date' },
            time: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
            service_provider_id: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            code: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
