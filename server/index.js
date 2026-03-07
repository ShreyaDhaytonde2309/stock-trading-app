const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB().then(async () => {
    // Basic Seeding Logic
    const { Stock } = require('./models/Schemas');
    const count = await Stock.countDocuments();
    if (count === 0) {
        console.log('Seeding initial stock data...');
        const initialStocks = [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 182.52, stockExchange: 'NASDAQ', change: 1.25, changePercent: 0.69 },
            { symbol: 'TSLA', name: 'Tesla, Inc.', price: 175.05, stockExchange: 'NASDAQ', change: -3.40, changePercent: -1.91 },
            { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.50, stockExchange: 'NASDAQ', change: 2.15, changePercent: 0.52 },
            { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 178.22, stockExchange: 'NASDAQ', change: 0.85, changePercent: 0.48 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.65, stockExchange: 'NASDAQ', change: 1.12, changePercent: 0.79 },
            { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, stockExchange: 'NASDAQ', change: 15.40, changePercent: 1.79 }
        ];
        await Stock.insertMany(initialStocks);
        console.log('Seeding complete.');
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', require('./Routes/userRoute'));
app.use('/api/stock', require('./Routes/stockRoute'));
app.use('/api/transaction', require('./Routes/transactionRoute'));
app.use('/api/order', require('./Routes/orderRoute'));
app.use('/api/watchlist', require('./Routes/watchlistRoute'));

app.get('/', (req, res) => {
    res.send('Stock Trading API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
