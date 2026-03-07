const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionController');
const authMiddleware = require('../Middlewares/authMiddleware');
const adminMiddleware = require('../Middlewares/adminMiddleware');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/portfolio', authMiddleware, transactionController.getPortfolio);
router.get('/my', authMiddleware, transactionController.getUserTransactions);
router.get('/all', [authMiddleware, adminMiddleware], transactionController.getAllTransactions);

module.exports = router;
