/**
 * Orbital calculations for 3D visualization
 * Converts orbital elements to 3D coordinates
 */

/**
 * Calculate points along an elliptical orbit
 * @param {number} semiMajorAxis - Semi-major axis in AU
 * @param {number} eccentricity - Orbital eccentricity (0-1)
 * @param {number} numPoints - Number of points to generate
 * @returns {Array} Array of {x, y, z} coordinates
 */
export function calculateOrbitPoints(semiMajorAxis = 1, eccentricity = 0, numPoints = 100) {
  const points = [];
  const angleStep = (2 * Math.PI) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const angle = i * angleStep;
    
    // Calculate radius at this angle using ellipse equation
    const radius = (semiMajorAxis * (1 - eccentricity * eccentricity)) / 
                   (1 + eccentricity * Math.cos(angle));
    
    // Convert polar to Cartesian coordinates
    const x = radius * Math.cos(angle);
    const y = 0; // Simplified to 2D orbit in XZ plane
    const z = radius * Math.sin(angle);
    
    points.push({ x, y, z });
  }

  return points;
}

/**
 * Calculate Earth's orbit (reference orbit)
 * @param {number} numPoints - Number of points
 * @returns {Array} Array of {x, y, z} coordinates
 */
export function calculateEarthOrbit(numPoints = 100) {
  return calculateOrbitPoints(1.0, 0.0167, numPoints); // Earth's orbital parameters
}

/**
 * Scale factor for visualization
 * Converts astronomical units to Three.js units
 */
export const SCALE_FACTOR = 10; // 1 AU = 10 Three.js units

/**
 * Scale a distance from AU to Three.js units
 * @param {number} au - Distance in astronomical units
 * @returns {number} Scaled distance
 */
export function scaleDistance(au) {
  return au * SCALE_FACTOR;
}

/**
 * Get asteroid position at a specific time
 * Simplified calculation for visualization
 * @param {number} semiMajorAxis - Semi-major axis in AU
 * @param {number} eccentricity - Eccentricity
 * @param {number} time - Time parameter (0-1 for one orbit)
 * @returns {Object} {x, y, z} position
 */
export function getAsteroidPosition(semiMajorAxis, eccentricity, time = 0) {
  const angle = time * 2 * Math.PI;
  const radius = (semiMajorAxis * (1 - eccentricity * eccentricity)) / 
                 (1 + eccentricity * Math.cos(angle));
  
  return {
    x: radius * Math.cos(angle),
    y: 0,
    z: radius * Math.sin(angle)
  };
}

/**
 * Parse orbital data from NASA API
 * @param {Object} orbitalData - Orbital data from asteroid object
 * @returns {Object} Parsed orbital parameters
 */
export function parseOrbitalData(orbitalData) {
  if (!orbitalData) {
    return {
      semiMajorAxis: 1.5,
      eccentricity: 0.1,
      inclination: 0
    };
  }

  return {
    semiMajorAxis: parseFloat(orbitalData.semi_major_axis) || 1.5,
    eccentricity: parseFloat(orbitalData.eccentricity) || 0.1,
    inclination: parseFloat(orbitalData.inclination) || 0
  };
}
