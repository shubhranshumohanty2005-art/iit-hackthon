/**
 * Calculate risk score for an asteroid based on multiple factors
 * @param {Object} asteroidData - NASA asteroid data
 * @returns {Object} Risk score and level
 */
const calculateRiskScore = (asteroidData) => {
  let score = 0;
  
  // Factor 1: Hazardous classification (40 points)
  if (asteroidData.is_potentially_hazardous_asteroid) {
    score += 40;
  }
  
  // Factor 2: Miss distance (30 points)
  // Get the closest approach
  const closeApproaches = asteroidData.close_approach_data || [];
  if (closeApproaches.length > 0) {
    const closestApproach = closeApproaches.reduce((closest, current) => {
      const closestDist = parseFloat(closest.miss_distance.astronomical);
      const currentDist = parseFloat(current.miss_distance.astronomical);
      return currentDist < closestDist ? current : closest;
    });
    
    const missDistanceAU = parseFloat(closestApproach.miss_distance.astronomical);
    
    // Closer = higher risk
    // 0.05 AU or less = 30 points
    // 0.05-0.1 AU = 20 points
    // 0.1-0.2 AU = 10 points
    // > 0.2 AU = 5 points
    if (missDistanceAU <= 0.05) {
      score += 30;
    } else if (missDistanceAU <= 0.1) {
      score += 20;
    } else if (missDistanceAU <= 0.2) {
      score += 10;
    } else {
      score += 5;
    }
  }
  
  // Factor 3: Diameter (20 points)
  const estimatedDiameter = asteroidData.estimated_diameter?.meters;
  if (estimatedDiameter) {
    const avgDiameter = (estimatedDiameter.estimated_diameter_min + 
                        estimatedDiameter.estimated_diameter_max) / 2;
    
    // Larger = higher risk
    // > 1000m = 20 points
    // 500-1000m = 15 points
    // 100-500m = 10 points
    // < 100m = 5 points
    if (avgDiameter > 1000) {
      score += 20;
    } else if (avgDiameter > 500) {
      score += 15;
    } else if (avgDiameter > 100) {
      score += 10;
    } else {
      score += 5;
    }
  }
  
  // Factor 4: Velocity (10 points)
  if (closeApproaches.length > 0) {
    const velocity = parseFloat(closeApproaches[0].relative_velocity.kilometers_per_second);
    
    // Faster = higher risk
    // > 30 km/s = 10 points
    // 20-30 km/s = 7 points
    // 10-20 km/s = 5 points
    // < 10 km/s = 3 points
    if (velocity > 30) {
      score += 10;
    } else if (velocity > 20) {
      score += 7;
    } else if (velocity > 10) {
      score += 5;
    } else {
      score += 3;
    }
  }
  
  // Determine risk level
  let riskLevel;
  if (score >= 75) {
    riskLevel = 'CRITICAL';
  } else if (score >= 50) {
    riskLevel = 'HIGH';
  } else if (score >= 25) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }
  
  return {
    score: Math.min(score, 100), // Cap at 100
    level: riskLevel,
  };
};

/**
 * Get detailed risk analysis for an asteroid
 * @param {Object} asteroidData - NASA asteroid data
 * @returns {Object} Detailed risk analysis
 */
const getDetailedRiskAnalysis = (asteroidData) => {
  const riskScore = calculateRiskScore(asteroidData);
  
  const closeApproaches = asteroidData.close_approach_data || [];
  const closestApproach = closeApproaches.length > 0 
    ? closeApproaches.reduce((closest, current) => {
        const closestDist = parseFloat(closest.miss_distance.astronomical);
        const currentDist = parseFloat(current.miss_distance.astronomical);
        return currentDist < closestDist ? current : closest;
      })
    : null;
  
  const estimatedDiameter = asteroidData.estimated_diameter?.meters;
  const avgDiameter = estimatedDiameter 
    ? (estimatedDiameter.estimated_diameter_min + estimatedDiameter.estimated_diameter_max) / 2
    : null;
  
  return {
    ...riskScore,
    factors: {
      isHazardous: asteroidData.is_potentially_hazardous_asteroid,
      missDistance: closestApproach 
        ? parseFloat(closestApproach.miss_distance.astronomical)
        : null,
      diameter: avgDiameter,
      velocity: closestApproach 
        ? parseFloat(closestApproach.relative_velocity.kilometers_per_second)
        : null,
      closeApproachDate: closestApproach?.close_approach_date_full,
    },
  };
};

module.exports = {
  calculateRiskScore,
  getDetailedRiskAnalysis,
};
