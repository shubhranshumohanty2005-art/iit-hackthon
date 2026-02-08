import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { asteroidsAPI, watchlistAPI } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import Chat from '../components/Chat';
import OrbitVisualization from '../components/OrbitVisualization';
import './AsteroidDetail.css';

const AsteroidDetail = () => {
  const { id } = useParams();
  const [asteroid, setAsteroid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    fetchAsteroid();
    checkWatchlist();
  }, [id]);

  const fetchAsteroid = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await asteroidsAPI.getById(id);
      setAsteroid(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch asteroid details');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlist = async () => {
    try {
      const response = await watchlistAPI.getWatchlist();
      const inList = response.data.some(item => item.asteroidId === id);
      setIsInWatchlist(inList);
    } catch (err) {
      console.error('Failed to check watchlist:', err);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await watchlistAPI.addToWatchlist(id);
      setIsInWatchlist(true);
      alert('Added to watchlist!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to watchlist');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="error-message">{error}</div>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!asteroid) return null;

  const riskAnalysis = asteroid.risk_analysis || {};
  const closeApproach = asteroid.close_approach_data?.[0];
  const diameter = asteroid.estimated_diameter?.meters;
  const orbitalData = asteroid.orbital_data;

  return (
    <div className="asteroid-detail">
      <div className="container">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="detail-header">
          <div>
            <h1>{asteroid.name}</h1>
            <p className="asteroid-id">ID: {asteroid.id}</p>
          </div>
          <RiskBadge level={riskAnalysis.level || 'LOW'} />
        </div>

        <div className="detail-grid">
          {/* Risk Analysis Card */}
          <div className="detail-card card">
            <h2>🎯 Risk Analysis</h2>
            <div className="risk-score-display">
              <div className="score-circle">
                <span className="score-value">{riskAnalysis.score || 0}</span>
                <span className="score-label">/ 100</span>
              </div>
            </div>

            <div className="detail-info">
              <div className="info-row">
                <span className="info-label">Risk Level:</span>
                <span className="info-value">{riskAnalysis.level || 'LOW'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Potentially Hazardous:</span>
                <span className="info-value">
                  {asteroid.is_potentially_hazardous_asteroid ? '⚠️ Yes' : '✅ No'}
                </span>
              </div>
              {riskAnalysis.factors && (
                <>
                  <div className="info-row">
                    <span className="info-label">Miss Distance:</span>
                    <span className="info-value">
                      {riskAnalysis.factors.missDistance?.toFixed(4)} AU
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Velocity:</span>
                    <span className="info-value">
                      {riskAnalysis.factors.velocity?.toFixed(2)} km/s
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Physical Characteristics */}
          <div className="detail-card card">
            <h2>📏 Physical Characteristics</h2>
            <div className="detail-info">
              {diameter && (
                <>
                  <div className="info-row">
                    <span className="info-label">Min Diameter:</span>
                    <span className="info-value">
                      {diameter.estimated_diameter_min.toFixed(2)} m
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Max Diameter:</span>
                    <span className="info-value">
                      {diameter.estimated_diameter_max.toFixed(2)} m
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Avg Diameter:</span>
                    <span className="info-value">
                      {((diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2).toFixed(2)} m
                    </span>
                  </div>
                </>
              )}
              <div className="info-row">
                <span className="info-label">Absolute Magnitude:</span>
                <span className="info-value">{asteroid.absolute_magnitude_h}</span>
              </div>
            </div>
          </div>

          {/* Close Approach Data */}
          {closeApproach && (
            <div className="detail-card card">
              <h2>🚀 Close Approach</h2>
              <div className="detail-info">
                <div className="info-row">
                  <span className="info-label">Date:</span>
                  <span className="info-value">
                    {new Date(closeApproach.close_approach_date_full).toLocaleString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Relative Velocity:</span>
                  <span className="info-value">
                    {parseFloat(closeApproach.relative_velocity.kilometers_per_second).toFixed(2)} km/s
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Miss Distance (AU):</span>
                  <span className="info-value">
                    {parseFloat(closeApproach.miss_distance.astronomical).toFixed(6)} AU
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Miss Distance (km):</span>
                  <span className="info-value">
                    {parseFloat(closeApproach.miss_distance.kilometers).toLocaleString()} km
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Orbiting Body:</span>
                  <span className="info-value">{closeApproach.orbiting_body}</span>
                </div>
              </div>
            </div>
          )}

          {/* Orbital Data */}
          {orbitalData && (
            <div className="detail-card card">
              <h2>🌍 Orbital Data</h2>
              <div className="detail-info">
                <div className="info-row">
                  <span className="info-label">Orbit ID:</span>
                  <span className="info-value">{orbitalData.orbit_id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Orbit Determination Date:</span>
                  <span className="info-value">
                    {new Date(orbitalData.orbit_determination_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">First Observation:</span>
                  <span className="info-value">
                    {new Date(orbitalData.first_observation_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Observation:</span>
                  <span className="info-value">
                    {new Date(orbitalData.last_observation_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Observations Used:</span>
                  <span className="info-value">{orbitalData.observations_used}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Orbital Visualization */}
        <OrbitVisualization asteroid={asteroid} />

        {/* Real-time Chat Section */}
        <div className="chat-section">
          <Chat asteroidId={id} />
        </div>

        {/* Action Buttons */}
        <div className="detail-actions">
          {!isInWatchlist && (
            <button onClick={handleAddToWatchlist} className="btn btn-primary btn-large">
              Add to Watchlist
            </button>
          )}
          {isInWatchlist && (
            <div className="watchlist-badge">
              ✓ In Watchlist
            </div>
          )}
          <a
            href={asteroid.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-large"
          >
            View on NASA JPL
          </a>
        </div>
      </div>
    </div>
  );
};

export default AsteroidDetail;
