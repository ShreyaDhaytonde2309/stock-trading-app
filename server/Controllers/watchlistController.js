const { Watchlist, Stock } = require('../models/Schemas');

exports.getWatchlist = async (req, res) => {
    try {
        let watchlist = await Watchlist.findOne({ user: req.user.id }).populate('stocks');
        if (!watchlist) {
            watchlist = new Watchlist({ user: req.user.id, stocks: [] });
            await watchlist.save();
        }
        res.json(watchlist);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.toggleWatchlist = async (req, res) => {
    const { stockId } = req.body;
    try {
        let watchlist = await Watchlist.findOne({ user: req.user.id });
        if (!watchlist) {
            watchlist = new Watchlist({ user: req.user.id, stocks: [stockId] });
        } else {
            const index = watchlist.stocks.indexOf(stockId);
            if (index > -1) {
                watchlist.stocks.splice(index, 1);
            } else {
                watchlist.stocks.push(stockId);
            }
        }
        await watchlist.save();
        res.json(watchlist);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
