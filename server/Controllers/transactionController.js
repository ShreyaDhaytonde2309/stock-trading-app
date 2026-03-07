const { Transaction, User, Stock, Portfolio } = require('../models/Schemas');

exports.createTransaction = async (req, res) => {
    const { type, stockSymbol, quantity, price, amount: depositAmount } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        let amount = type === 'DEPOSIT' ? depositAmount : (quantity * price);
        let transactionData = {
            user: req.user.id,
            type,
            amount
        };

        if (type === 'DEPOSIT') {
            user.balance += Number(depositAmount);
        } else {
            const stock = await Stock.findOne({ symbol: stockSymbol });
            if (!stock) return res.status(404).json({ msg: 'Stock not found' });

            transactionData.stockSymbol = stockSymbol;
            transactionData.quantity = quantity;
            transactionData.price = price;

            if (type === 'BUY') {
                if (user.balance < amount) {
                    return res.status(400).json({ msg: 'Insufficient balance' });
                }
                user.balance -= amount;

                let portfolioItem = await Portfolio.findOne({ user: req.user.id, stock: stock._id });
                if (portfolioItem) {
                    const totalCost = (portfolioItem.avgPrice * portfolioItem.quantity) + amount;
                    portfolioItem.quantity += parseInt(quantity);
                    portfolioItem.avgPrice = totalCost / portfolioItem.quantity;
                    await portfolioItem.save();
                } else {
                    portfolioItem = new Portfolio({
                        user: req.user.id,
                        stock: stock._id,
                        quantity: parseInt(quantity),
                        avgPrice: price
                    });
                    await portfolioItem.save();
                }
            } else if (type === 'SELL') {
                let portfolioItem = await Portfolio.findOne({ user: req.user.id, stock: stock._id });
                if (!portfolioItem || portfolioItem.quantity < quantity) {
                    return res.status(400).json({ msg: 'Insufficient stock quantity' });
                }
                user.balance += amount;
                portfolioItem.quantity -= parseInt(quantity);
                if (portfolioItem.quantity === 0) {
                    await Portfolio.deleteOne({ _id: portfolioItem._id });
                } else {
                    await portfolioItem.save();
                }
            }
        }

        const transaction = new Transaction(transactionData);
        await user.save();
        await transaction.save();
        res.json({ transaction, user: { id: user.id, balance: user.balance, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ user: req.user.id }).populate('stock');
        res.json(portfolio);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user', 'username email').sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
