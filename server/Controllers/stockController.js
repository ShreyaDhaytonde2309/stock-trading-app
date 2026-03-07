const { Stock } = require('../models/Schemas');

exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.addStock = async (req, res) => {
    const { symbol, name, price, stockExchange } = req.body;
    try {
        const newStock = new Stock({ symbol, name, price, stockExchange });
        await newStock.save();
        res.json(newStock);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateStock = async (req, res) => {
    try {
        const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(stock);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
exports.deleteStock = async (req, res) => {
    try {
        await Stock.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Stock deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
