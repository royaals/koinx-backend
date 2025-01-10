const axios = require('axios');
const CryptoData = require('../models/cryptoData');

class CryptoService {
    static VALID_COINS = ['bitcoin', 'matic-network', 'ethereum'];

    static async fetchAndStoreCryptoData(retries = 3) {
        try {
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price',
                {
                    params: {
                        ids: this.VALID_COINS.join(','),
                        vs_currencies: 'usd',
                        include_market_cap: true,
                        include_24hr_change: true
                    }
                }
            );

            const records = [];
            for (const coinId of this.VALID_COINS) {
                const coinData = response.data[coinId];
                if (!coinData || !coinData.usd) {
                    console.error(`Invalid data received for ${coinId}:`, coinData);
                    continue;
                }

                records.push({
                    coinId,
                    price: coinData.usd,
                    marketCap: coinData.usd_market_cap,
                    priceChange24h: coinData.usd_24h_change,
                    timestamp: new Date()
                });
            }

            if (records.length > 0) {
                await CryptoData.insertMany(records);
                console.log(`Successfully stored data for ${records.length} coins`);
            }

        } catch (error) {
            console.error('Fetch Error:', error.message);
            if (retries > 0) {
                console.log(`Retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.fetchAndStoreCryptoData(retries - 1);
            }
            throw error;
        }
    }

    static async getLatestStats(coinId) {
        if (!this.VALID_COINS.includes(coinId)) {
            throw new Error(`Invalid coin: ${coinId}`);
        }

        const latestData = await CryptoData.findOne({ coinId })
            .sort({ timestamp: -1 })
            .lean();

        if (!latestData) {
            throw new Error(`No data available for ${coinId}`);
        }

        return {
            price: latestData.price,
            marketCap: latestData.marketCap,
            "24hChange": latestData.priceChange24h,
            lastUpdated: latestData.timestamp
        };
    }

    static async getPriceDeviation(coinId) {
        if (!this.VALID_COINS.includes(coinId)) {
            throw new Error(`Invalid coin: ${coinId}`);
        }

        const prices = await CryptoData.find({ coinId })
            .sort({ timestamp: -1 })
            .limit(100)
            .select('price')
            .lean();

        if (prices.length === 0) {
            throw new Error(`No price data available for ${coinId}`);
        }

        const priceValues = prices.map(p => p.price);
        const mean = priceValues.reduce((a, b) => a + b) / priceValues.length;
        const squareDiffs = priceValues.map(price => Math.pow(price - mean, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
        const stdDev = Math.sqrt(avgSquareDiff);

        return {
            deviation: Number(stdDev.toFixed(2)),
            sampleSize: prices.length,
            mean: Number(mean.toFixed(2))
        };
    }
}

module.exports = CryptoService;