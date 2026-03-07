const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

// @route   POST api/trades/buy
// @desc    Buy stock
router.post('/buy', auth, async (req, res) => {
    const { stockSymbol, quantity } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const stock = await Stock.findOne({ symbol: stockSymbol });

        if (!stock) return res.status(404).json({ msg: 'Stock not found' });

        const totalCost = stock.price * quantity;
        if (user.balance < totalCost) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }

        // Update user balance
        user.balance -= totalCost;
        await user.save();

        // Update Portfolio
        let portfolioItem = await Portfolio.findOne({ user: user.id, stock: stock.id });
        if (portfolioItem) {
            const newTotalQty = portfolioItem.quantity + parseInt(quantity);
            const newAvgPrice = ((portfolioItem.quantity * portfolioItem.avgPrice) + totalCost) / newTotalQty;
            portfolioItem.quantity = newTotalQty;
            portfolioItem.avgPrice = newAvgPrice;
        } else {
            portfolioItem = new Portfolio({
                user: user.id,
                stock: stock.id,
                quantity,
                avgPrice: stock.price
            });
        }
        await portfolioItem.save();

        // Create transaction record
        const transaction = new Transaction({
            user: user.id,
            stockSymbol,
            type: 'BUY',
            quantity,
            price: stock.price,
            total: totalCost
        });
        await transaction.save();

        res.json({ balance: user.balance, portfolioItem, transaction });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/trades/sell
// @desc    Sell stock
router.post('/sell', auth, async (req, res) => {
    const { stockSymbol, quantity } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const stock = await Stock.findOne({ symbol: stockSymbol });
        let portfolioItem = await Portfolio.findOne({ user: user.id, stock: stock.id });

        if (!portfolioItem || portfolioItem.quantity < quantity) {
            return res.status(400).json({ msg: 'Insufficient stock quantity' });
        }

        const totalGain = stock.price * quantity;
        user.balance += totalGain;
        await user.save();

        portfolioItem.quantity -= parseInt(quantity);
        if (portfolioItem.quantity === 0) {
            await Portfolio.deleteOne({ _id: portfolioItem._id });
        } else {
            await portfolioItem.save();
        }

        const transaction = new Transaction({
            user: user.id,
            stockSymbol,
            type: 'SELL',
            quantity,
            price: stock.price,
            total: totalGain
        });
        await transaction.save();

        res.json({ balance: user.balance, portfolioItem, transaction });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/trades/portfolio
// @desc    Get user portfolio
router.get('/portfolio', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ user: req.user.id }).populate('stock');
        res.json(portfolio);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/trades/history
// @desc    Get user transaction history
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
