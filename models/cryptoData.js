const mongoose = require('mongoose');

const cryptoDataSchema = new mongoose.Schema({
    coinId: {
        type: String,
        required: true,
        enum: ['bitcoin', 'matic-network', 'ethereum']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    marketCap: {
        type: Number,
        required: true,
        min: 0
    },
    priceChange24h: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});


cryptoDataSchema.index({ coinId: 1, timestamp: -1 });
cryptoDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model('CryptoData', cryptoDataSchema);