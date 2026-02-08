const nasaService = require('../services/nasaService');
const { getDetailedRiskAnalysis } = require('../services/riskAnalysis');

/**
 * Get asteroid feed for date range
 * GET /api/asteroids/feed
 */
const getAsteroidFeed = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Default to today if no dates provided
    const today = new Date().toISOString().split('T')[0];
    const startDate = start_date || today;
    const endDate = end_date || today;
    
    const feedData = await nasaService.getAsteroidFeed(startDate, endDate);
    
    // Add risk analysis to each asteroid
    const processedData = { ...feedData };
    const nearEarthObjects = processedData.near_earth_objects;
    
    for (const date in nearEarthObjects) {
      processedData.near_earth_objects[date] = nearEarthObjects[date].map(asteroid => ({
        ...asteroid,
        risk_analysis: getDetailedRiskAnalysis(asteroid),
      }));
    }
    
    res.json(processedData);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch asteroid feed' });
  }
};

/**
 * Get specific asteroid by ID
 * GET /api/asteroids/:id
 */
const getAsteroidById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const asteroidData = await nasaService.getAsteroidById(id);
    
    // Add risk analysis
    const processedData = {
      ...asteroidData,
      risk_analysis: getDetailedRiskAnalysis(asteroidData),
    };
    
    res.json(processedData);
  } catch (error) {
    console.error('Get asteroid by ID error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch asteroid details' });
  }
};

/**
 * Browse asteroid database
 * GET /api/asteroids/browse
 */
const browseAsteroids = async (req, res) => {
  try {
    const { page = 0, size = 20 } = req.query;
    
    const browseData = await nasaService.browseAsteroids(
      parseInt(page),
      parseInt(size)
    );
    
    // Add risk analysis to each asteroid
    const processedData = {
      ...browseData,
      near_earth_objects: browseData.near_earth_objects.map(asteroid => ({
        ...asteroid,
        risk_analysis: getDetailedRiskAnalysis(asteroid),
      })),
    };
    
    res.json(processedData);
  } catch (error) {
    console.error('Browse asteroids error:', error);
    res.status(500).json({ message: error.message || 'Failed to browse asteroids' });
  }
};

module.exports = {
  getAsteroidFeed,
  getAsteroidById,
  browseAsteroids,
};
