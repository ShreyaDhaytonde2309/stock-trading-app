const mongoose = require('mongoose');
const { Stock } = require('./models/Schemas');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const stocks = await Stock.find();
        console.log('Stocks in DB:', stocks.length);
        if (stocks.length > 0) {
            console.log('First stock:', stocks[0].symbol);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}
check();
