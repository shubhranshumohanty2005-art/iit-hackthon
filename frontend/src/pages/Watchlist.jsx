import { useState, useEffect } from 'react';
import { watchlistAPI } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import { Link } from 'react-router-dom';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await watchlistAPI.getWatchlist();
      setWatchlist(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this asteroid from your watchlist?')) return;

    try {
      await watchlistAPI.removeFromWatchlist(id);
      fetchWatchlist();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove from watchlist');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="watchlist">
      <div className="container">
        <div className="watchlist-header">
          <h1>My Watchlist</h1>
          <p className="text-muted">Track your monitored asteroids</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {watchlist.length === 0 ? (
          <div className="empty-state card">
            <h2>No asteroids in watchlist</h2>
            <p>Add asteroids from the dashboard to start monitoring them</p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="watchlist-grid grid grid-2">
            {watchlist.map((item) => (
              <div key={item._id} className="watchlist-item card">
                <div className="watchlist-item-header">
                  <h3>{item.asteroidName}</h3>
                  <RiskBadge level={item.riskLevel} />
                </div>

                <div className="watchlist-item-info">
                  <div className="info-row">
                    <span className="info-label">Risk Score:</span>
                    <span className="info-value">{item.riskScore}/100</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Added:</span>
                    <span className="info-value">
                      {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Last Checked:</span>
                    <span className="info-value">
                      {new Date(item.lastChecked).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="watchlist-item-actions">
                  <Link 
                    to={`/asteroid/${item.asteroidId}`}
                    className="btn btn-secondary"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
