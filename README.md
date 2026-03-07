# SB Stocks - Virtual Stock Trading Platform

SB Stocks is a full-stack MERN application that allows users to practice stock trading with virtual funds and real-time data.

## Features
- **Registration/Login**: Secure JWT-based authentication.
- **Virtual Funds**: Start with $100,000 virtual balance.
- **Stock Dashboard**: Real-time stock prices and trends.
- **Trading**: Buy and sell stocks instantly.
- **Portfolio Tracking**: Monitor your holdings and performance.

## Tech Stack
- **Frontend**: React, Redux Toolkit, Vite, Chart.js, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Security**: JWT, BcryptJS.

## Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB installed locally or a MongoDB Atlas URI.

### 2. Backend Setup
1. Open the `server` directory.
2. Ensure your `.env` file has the correct `MONGODB_URI`.
3. Run `npm install`.
4. Run `npm run dev` (starts server with nodemon).

### 3. Frontend Setup
1. Open the `client` directory.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173` in your browser.

## Admin Note
To make a user an admin, manually change the `role` field in the MongoDB `users` collection to `'admin'`.
