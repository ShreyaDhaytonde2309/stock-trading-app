const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    quantity: { type: Number, required: true, default: 0 },
    avgPrice: { type: Number, required: true },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
