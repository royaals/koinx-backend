const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypto Stats API Documentation',
      version: '1.0.0',
      description: 'API documentation for cryptocurrency statistics and price deviation analysis',
      contact: {
        name: 'Your Name',
        email: 'your.email@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ],
    components: {
      schemas: {
        CryptoStats: {
          type: 'object',
          properties: {
            price: {
              type: 'number',
              example: 40000,
            },
            marketCap: {
              type: 'number',
              example: 800000000,
            },
            '24hChange': {
              type: 'number',
              example: 3.4,
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
              example: '2023-07-20T10:30:00.000Z',
            },
          },
        },
        Deviation: {
          type: 'object',
          properties: {
            deviation: {
              type: 'number',
              example: 4082.48,
            },
            sampleSize: {
              type: 'number',
              example: 100,
            },
            mean: {
              type: 'number',
              example: 40000,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options);