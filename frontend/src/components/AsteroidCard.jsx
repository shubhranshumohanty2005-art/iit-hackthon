import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import './AsteroidCard.css';

const AsteroidCard = ({ asteroid, onAddToWatchlist, isInWatchlist }) => {
  const riskAnalysis = asteroid.risk_analysis || {};
  const closeApproach = asteroid.close_approach_data?.[0];
  const diameter = asteroid.estimated_diameter?.meters;
  const avgDiameter = diameter 
    ? ((diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2).toFixed(0)
    : 'Unknown';

  return (
    <div className="asteroid-card card">
      <div className="asteroid-header">
        <h3 className="asteroid-name">{asteroid.name}</h3>
        <RiskBadge level={riskAnalysis.level || 'LOW'} />
      </div>

      <div className="asteroid-info">
        <div className="info-row">
          <span className="info-label">Risk Score:</span>
          <span className="info-value">{riskAnalysis.score || 0}/100</span>
        </div>

        <div className="info-row">
          <span className="info-label">Diameter:</span>
          <span className="info-value">~{avgDiameter}m</span>
        </div>

        {closeApproach && (
          <>
            <div className="info-row">
              <span className="info-label">Miss Distance:</span>
              <span className="info-value">
                {parseFloat(closeApproach.miss_distance.astronomical).toFixed(4)} AU
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Velocity:</span>
              <span className="info-value">
                {parseFloat(closeApproach.relative_velocity.kilometers_per_second).toFixed(2)} km/s
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Approach Date:</span>
              <span className="info-value">
                {new Date(closeApproach.close_approach_date_full).toLocaleDateString()}
              </span>
            </div>
          </>
        )}

        {asteroid.is_potentially_hazardous_asteroid && (
          <div className="hazard-warning">
            ⚠️ Potentially Hazardous
          </div>
        )}
      </div>

      <div className="card-actions">
        <Link to={`/asteroid/${asteroid.id}`} className="btn btn-secondary">
          View Details
        </Link>
        {!isInWatchlist && (
          <button onClick={() => onAddToWatchlist(asteroid.id)} className="btn btn-primary">
            Add to Watchlist
          </button>
        )}
        {isInWatchlist && (
          <span className="watchlist-indicator">✓ In Watchlist</span>
        )}
      </div>
    </div>
  );
};

export default AsteroidCard;
