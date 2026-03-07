const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['BUY', 'SELL', 'DEPOSIT'], required: true },
    stockSymbol: { type: String, required: function() { return this.type !== 'DEPOSIT'; } },
    quantity: { type: Number, required: function() { return this.type !== 'DEPOSIT'; } },
    price: { type: Number, required: function() { return this.type !== 'DEPOSIT'; } },
    amount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
