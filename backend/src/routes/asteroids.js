const express = require('express');
const router = express.Router();
const {
  getAsteroidFeed,
  getAsteroidById,
  browseAsteroids,
} = require('../controllers/asteroidController');
const { protect } = require('../middleware/auth');

router.get('/feed', protect, getAsteroidFeed);
router.get('/browse', protect, browseAsteroids);
router.get('/:id', protect, getAsteroidById);

module.exports = router;
