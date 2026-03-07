const { Order } = require('../models/Schemas');

exports.createOrder = async (req, res) => {
    const { stockSymbol, quantity, type, totalAmount } = req.body;
    try {
        const order = new Order({
            user: req.user.id,
            stockSymbol,
            quantity,
            type,
            totalAmount
        });
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ time: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'username email').sort({ time: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
