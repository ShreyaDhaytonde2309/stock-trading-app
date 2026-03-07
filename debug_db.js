const mongoose = require('mongoose');
const { Stock } = require('./server/Models/Schemas');
require('dotenv').config({ path: './server/.env' });

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const stocks = await Stock.find();
    console.log('Stocks in DB:', stocks.length);
    console.log(JSON.stringify(stocks, null, 2));
    process.exit();
}
check();
