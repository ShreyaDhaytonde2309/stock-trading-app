const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    change: { type: Number, default: 0 },
    changePercent: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    sector: { type: String },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Stock', stockSchema);
