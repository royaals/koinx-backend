require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const connectDB = require('./config/db');
const cryptoRoutes = require('./routes/cryptoRoutes');
const CryptoService = require('./services/cryptoService');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Crypto Stats API Documentation",
    swaggerOptions: {
        persistAuthorization: true,
    },
}));

// Welcome Route
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to KoinX Backend API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 *                 status:
 *                   type: string
 *                   example: active
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to KoinX Backend API',
    });
});

// API Routes
app.use('/', cryptoRoutes);

// Schedule background job (every 2 hours)
cron.schedule('0 */2 * * *', () => {
    console.log('Running crypto data fetch job');
    CryptoService.fetchAndStoreCryptoData();
});

// Initial data fetch
CryptoService.fetchAndStoreCryptoData();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    console.log(`Welcome page available at http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});