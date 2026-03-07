const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stockSymbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELLED'], default: 'COMPLETED' },
    totalAmount: { type: Number, required: true },
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
