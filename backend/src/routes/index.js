const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const asteroidRoutes = require('./asteroids');
const watchlistRoutes = require('./watchlist');
const alertRoutes = require('./alerts');

// Mount routes
router.use('/auth', authRoutes);
router.use('/asteroids', asteroidRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/alerts', alertRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
