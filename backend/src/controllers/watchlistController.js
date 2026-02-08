const WatchedAsteroid = require('../models/WatchedAsteroid');
const User = require('../models/User');
const nasaService = require('../services/nasaService');
const { getDetailedRiskAnalysis } = require('../services/riskAnalysis');

/**
 * Get user's watchlist
 * GET /api/watchlist
 */
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await WatchedAsteroid.find({ userId: req.user._id })
      .sort({ addedAt: -1 });
    
    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist' });
  }
};

/**
 * Add asteroid to watchlist
 * POST /api/watchlist
 */
const addToWatchlist = async (req, res) => {
  try {
    const { asteroidId } = req.body;
    
    if (!asteroidId) {
      return res.status(400).json({ message: 'Asteroid ID is required' });
    }
    
    // Check if already in watchlist
    const existing = await WatchedAsteroid.findOne({
      userId: req.user._id,
      asteroidId,
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Asteroid already in watchlist' });
    }
    
    // Fetch asteroid data from NASA
    const asteroidData = await nasaService.getAsteroidById(asteroidId);
    const riskAnalysis = getDetailedRiskAnalysis(asteroidData);
    
    // Create watched asteroid
    const watchedAsteroid = await WatchedAsteroid.create({
      userId: req.user._id,
      asteroidId,
      asteroidName: asteroidData.name,
      asteroidData,
      riskScore: riskAnalysis.score,
      riskLevel: riskAnalysis.level,
    });
    
    // Add to user's watchlist
    await User.findByIdAndUpdate(req.user._id, {
      $push: { watchlist: watchedAsteroid._id },
    });
    
    res.status(201).json(watchedAsteroid);
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: error.message || 'Failed to add to watchlist' });
  }
};

/**
 * Remove from watchlist
 * DELETE /api/watchlist/:id
 */
const removeFromWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const watchedAsteroid = await WatchedAsteroid.findOne({
      _id: id,
      userId: req.user._id,
    });
    
    if (!watchedAsteroid) {
      return res.status(404).json({ message: 'Watched asteroid not found' });
    }
    
    await WatchedAsteroid.deleteOne({ _id: id });
    
    // Remove from user's watchlist
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchlist: id },
    });
    
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Failed to remove from watchlist' });
  }
};

/**
 * Update alert settings for watched asteroid
 * PUT /api/watchlist/:id/alerts
 */
const updateAlertSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { notifyOnApproach, distanceThreshold } = req.body;
    
    const watchedAsteroid = await WatchedAsteroid.findOne({
      _id: id,
      userId: req.user._id,
    });
    
    if (!watchedAsteroid) {
      return res.status(404).json({ message: 'Watched asteroid not found' });
    }
    
    if (notifyOnApproach !== undefined) {
      watchedAsteroid.alertSettings.notifyOnApproach = notifyOnApproach;
    }
    
    if (distanceThreshold !== undefined) {
      watchedAsteroid.alertSettings.distanceThreshold = distanceThreshold;
    }
    
    await watchedAsteroid.save();
    
    res.json(watchedAsteroid);
  } catch (error) {
    console.error('Update alert settings error:', error);
    res.status(500).json({ message: 'Failed to update alert settings' });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateAlertSettings,
};
