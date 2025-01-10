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
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Check if MongoDB URI is configured
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

// Connect to MongoDB
connectDB()
    .then(() => {
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
        app.get('/', (req, res) => {
            res.json({
                message: 'Welcome to KoinX Backend API',
            });
        });

        // Routes
        app.use('/', cryptoRoutes);

        // Schedule background job (every 2 hours)
        cron.schedule('0 */2 * * *', () => {
            console.log('Running crypto data fetch job');
            CryptoService.fetchAndStoreCryptoData();
        });

        // Initial data fetch
        CryptoService.fetchAndStoreCryptoData();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
            console.log(`Welcome page available at http://localhost:${PORT}/`);
        });
    })
    .catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});