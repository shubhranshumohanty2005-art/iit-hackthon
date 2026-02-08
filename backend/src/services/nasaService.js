const axios = require('axios');

const NASA_API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

/**
 * Fetch asteroid feed for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Asteroid feed data
 */
const getAsteroidFeed = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${NASA_API_BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: API_KEY,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('NASA API Error (Feed):', error.response?.data || error.message);
    throw new Error('Failed to fetch asteroid feed from NASA API');
  }
};

/**
 * Lookup specific asteroid by ID
 * @param {string} asteroidId - NASA asteroid ID
 * @returns {Promise<Object>} Asteroid details
 */
const getAsteroidById = async (asteroidId) => {
  try {
    const response = await axios.get(`${NASA_API_BASE_URL}/neo/${asteroidId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('NASA API Error (Lookup):', error.response?.data || error.message);
    throw new Error('Failed to fetch asteroid details from NASA API');
  }
};

/**
 * Browse asteroid database
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 20)
 * @returns {Promise<Object>} Paginated asteroid list
 */
const browseAsteroids = async (page = 0, size = 20) => {
  try {
    const response = await axios.get(`${NASA_API_BASE_URL}/neo/browse`, {
      params: {
        page,
        size,
        api_key: API_KEY,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('NASA API Error (Browse):', error.response?.data || error.message);
    throw new Error('Failed to browse asteroids from NASA API');
  }
};

/**
 * Get today's asteroid feed
 * @returns {Promise<Object>} Today's asteroid data
 */
const getTodaysFeed = async () => {
  const today = new Date().toISOString().split('T')[0];
  return await getAsteroidFeed(today, today);
};

module.exports = {
  getAsteroidFeed,
  getAsteroidById,
  browseAsteroids,
  getTodaysFeed,
};
