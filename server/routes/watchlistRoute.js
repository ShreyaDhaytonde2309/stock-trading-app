const express = require('express');
const router = express.Router();
const watchlistController = require('../Controllers/watchlistController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.get('/', authMiddleware, watchlistController.getWatchlist);
router.post('/toggle', authMiddleware, watchlistController.toggleWatchlist);

module.exports = router;
