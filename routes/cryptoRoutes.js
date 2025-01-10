// routes/cryptoRoutes.js

const express = require("express");
const router = express.Router();
const CryptoService = require("../services/cryptoService");

/**
 * @swagger
 * components:
 *   schemas:
 *     CryptoStats:
 *       type: object
 *       properties:
 *         price:
 *           type: number
 *           description: Current price in USD
 *           example: 40000
 *         marketCap:
 *           type: number
 *           description: Market capitalization in USD
 *           example: 800000000
 *         24hChange:
 *           type: number
 *           description: 24-hour price change percentage
 *           example: 3.4
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           example: "2023-07-20T10:30:00.000Z"
 *     Deviation:
 *       type: object
 *       properties:
 *         deviation:
 *           type: number
 *           description: Standard deviation of price
 *           example: 4082.48
 *         sampleSize:
 *           type: number
 *           description: Number of samples used
 *           example: 100
 *         mean:
 *           type: number
 *           description: Mean price
 *           example: 40000
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Invalid cryptocurrency"
 */

// Middleware to validate coin parameter
const validateCoin = (req, res, next) => {
  const validCoins = ["bitcoin", "matic-network", "ethereum"];
  const coin = req.query.coin;

  if (!coin) {
    return res.status(400).json({
      error: "Coin parameter is required",
      validCoins: validCoins,
      example: "/stats?coin=bitcoin",
    });
  }

  if (!validCoins.includes(coin)) {
    return res.status(400).json({
      error: "Invalid coin parameter",
      validCoins: validCoins,
      provided: coin,
    });
  }

  next();
};

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get latest cryptocurrency statistics
 *     tags: [Crypto]
 *     parameters:
 *       - in: query
 *         name: coin
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bitcoin, matic-network, ethereum]
 *         description: Cryptocurrency identifier
 *     responses:
 *       200:
 *         description: Latest cryptocurrency statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CryptoStats'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/stats", validateCoin, async (req, res) => {
  try {
    const stats = await CryptoService.getLatestStats(req.query.coin);
    res.json(stats);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(error.message.includes("Invalid") ? 400 : 500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /deviation:
 *   get:
 *     summary: Get price standard deviation
 *     tags: [Crypto]
 *     parameters:
 *       - in: query
 *         name: coin
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bitcoin, matic-network, ethereum]
 *         description: Cryptocurrency identifier
 *     responses:
 *       200:
 *         description: Price standard deviation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deviation'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/deviation", validateCoin, async (req, res) => {
  try {
    const deviation = await CryptoService.getPriceDeviation(req.query.coin);
    res.json(deviation);
  } catch (error) {
    console.error("Deviation Error:", error);
    res.status(error.message.includes("Invalid") ? 400 : 500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /supported-coins:
 *   get:
 *     summary: Get list of supported cryptocurrencies
 *     tags: [System]
 *     responses:
 *       200:
 *         description: List of supported coins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coins:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["bitcoin", "matic-network", "ethereum"]
 */
router.get("/supported-coins", (req, res) => {
  res.json({
    coins: ["bitcoin", "matic-network", "ethereum"],
    lastUpdated: new Date().toISOString(),
  });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error("Route Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
