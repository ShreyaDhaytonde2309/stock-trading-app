const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/my', authMiddleware, orderController.getUserOrders);
router.get('/all', authMiddleware, orderController.getAllOrders);

module.exports = router;
