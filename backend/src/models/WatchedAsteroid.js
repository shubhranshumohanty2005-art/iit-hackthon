const mongoose = require('mongoose');

const watchedAsteroidSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  asteroidId: {
    type: String,
    required: true,
  },
  asteroidName: {
    type: String,
    required: true,
  },
  asteroidData: {
    type: Object,
    required: true,
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  },
  alertSettings: {
    notifyOnApproach: {
      type: Boolean,
      default: true,
    },
    distanceThreshold: {
      type: Number,
      default: 0.05, // AU (Astronomical Units)
    },
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user can't watch the same asteroid twice
watchedAsteroidSchema.index({ userId: 1, asteroidId: 1 }, { unique: true });

module.exports = mongoose.model('WatchedAsteroid', watchedAsteroidSchema);
