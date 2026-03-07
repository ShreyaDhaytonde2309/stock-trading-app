const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const { auth, admin } = require('../middleware/auth');

// @route   GET api/stocks
// @desc    Get all stocks
router.get('/', async (req, res) => {
    try {
        let stocks = await Stock.find();

        // Seed some data if empty for demo purposes
        if (stocks.length === 0) {
            const initialStocks = [
                { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 1.25, changePercent: 0.72, sector: 'Technology' },
                { symbol: 'TSLA', name: 'Tesla, Inc.', price: 242.12, change: -3.45, changePercent: -1.41, sector: 'Automotive' },
                { symbol: 'MSFT', name: 'Microsoft Corporation', price: 338.11, change: 2.10, changePercent: 0.63, sector: 'Technology' },
                { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 129.12, change: 0.85, changePercent: 0.66, sector: 'Consumer Cyclical' },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 136.45, change: 1.15, changePercent: 0.85, sector: 'Communication Services' },
                { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 450.20, change: 12.30, changePercent: 2.81, sector: 'Technology' },
                { symbol: 'META', name: 'Meta Platforms, Inc.', price: 298.67, change: -2.15, changePercent: -0.71, sector: 'Communication Services' },
            ];
            stocks = await Stock.insertMany(initialStocks);
        }

        res.json(stocks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/stocks
// @desc    Add/Update stock (Admin only)
router.post('/', [auth, admin], async (req, res) => {
    const { symbol, name, price, sector } = req.body;
    try {
        let stock = await Stock.findOne({ symbol });
        if (stock) {
            stock.price = price;
            stock.name = name;
            stock.sector = sector;
            stock.lastUpdated = Date.now();
        } else {
            stock = new Stock({ symbol, name, price, sector });
        }
        await stock.save();
        res.json(stock);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
