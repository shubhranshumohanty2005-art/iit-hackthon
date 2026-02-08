const cron = require('node-cron');
const WatchedAsteroid = require('../models/WatchedAsteroid');
const Alert = require('../models/Alert');
const nasaService = require('../services/nasaService');
const { getDetailedRiskAnalysis } = require('../services/riskAnalysis');

/**
 * Check watched asteroids and create alerts
 */
const checkWatchedAsteroids = async () => {
  try {
    console.log('Running scheduled check for watched asteroids...');
    
    const watchedAsteroids = await WatchedAsteroid.find({}).populate('userId');
    
    for (const watched of watchedAsteroids) {
      try {
        // Fetch latest data from NASA
        const asteroidData = await nasaService.getAsteroidById(watched.asteroidId);
        const riskAnalysis = getDetailedRiskAnalysis(asteroidData);
        
        // Update risk score
        const previousRiskScore = watched.riskScore;
        watched.riskScore = riskAnalysis.score;
        watched.riskLevel = riskAnalysis.level;
        watched.asteroidData = asteroidData;
        watched.lastChecked = new Date();
        
        // Check if risk increased significantly
        if (riskAnalysis.score > previousRiskScore + 10) {
          await Alert.create({
            userId: watched.userId,
            asteroidId: watched.asteroidId,
            asteroidName: watched.asteroidName,
            alertType: 'RISK_INCREASE',
            message: `Risk level increased for ${watched.asteroidName}. New risk score: ${riskAnalysis.score}`,
            severity: riskAnalysis.level === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
          });
        }
        
        // Check close approach
        if (watched.alertSettings.notifyOnApproach && riskAnalysis.factors.missDistance) {
          if (riskAnalysis.factors.missDistance <= watched.alertSettings.distanceThreshold) {
            await Alert.create({
              userId: watched.userId,
              asteroidId: watched.asteroidId,
              asteroidName: watched.asteroidName,
              alertType: 'CLOSE_APPROACH',
              message: `${watched.asteroidName} is approaching within ${riskAnalysis.factors.missDistance.toFixed(4)} AU on ${riskAnalysis.factors.closeApproachDate}`,
              severity: 'WARNING',
            });
          }
        }
        
        await watched.save();
      } catch (error) {
        console.error(`Error checking asteroid ${watched.asteroidId}:`, error.message);
      }
    }
    
    console.log('Scheduled check completed.');
  } catch (error) {
    console.error('Scheduler error:', error);
  }
};

/**
 * Initialize scheduler
 */
const initScheduler = () => {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', checkWatchedAsteroids);
  
  console.log('Scheduler initialized - checking watched asteroids every 6 hours');
};

module.exports = {
  initScheduler,
  checkWatchedAsteroids,
};
