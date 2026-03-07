const express = require('express');
const router = express.Router();
const stockController = require('../Controllers/stockController');
const authMiddleware = require('../Middlewares/authMiddleware');
const adminMiddleware = require('../Middlewares/adminMiddleware');

router.get('/', stockController.getAllStocks);
router.post('/', [authMiddleware, adminMiddleware], stockController.addStock);
router.put('/:id', [authMiddleware, adminMiddleware], stockController.updateStock);
router.delete('/:id', [authMiddleware, adminMiddleware], stockController.deleteStock);

module.exports = router;
