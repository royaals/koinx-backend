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


connectDB();


app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Crypto Stats API Documentation",
    swaggerOptions: {
        persistAuthorization: true,
    },
}));

app.use('/', cryptoRoutes);

// Schedule background job (every 2 hours)
cron.schedule('0 */2 * * *', () => {
    console.log('Running crypto data fetch job');
    CryptoService.fetchAndStoreCryptoData();
});


CryptoService.fetchAndStoreCryptoData();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






