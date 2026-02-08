import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { asteroidsAPI, watchlistAPI } from '../services/api';
import AsteroidCard from '../components/AsteroidCard';
import AsteroidChart from '../components/AsteroidChart';
import Chat from '../components/Chat';
import './Dashboard.css';

const Dashboard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [filteredAsteroids, setFilteredAsteroids] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchWatchlist();
  }, []);

  useEffect(() => {
    // Filter asteroids based on search query
    if (searchQuery.trim() === '') {
      setFilteredAsteroids(asteroids);
    } else {
      const filtered = asteroids.filter(asteroid =>
        asteroid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asteroid.id.includes(searchQuery)
      );
      setFilteredAsteroids(filtered);
    }
  }, [searchQuery, asteroids]);

  const fetchData = async (start = null, end = null) => {
    setLoading(true);
    setError('');

    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await asteroidsAPI.getFeed(
        start || today,
        end || today
      );

      // Flatten the near_earth_objects into a single array
      const allAsteroids = [];
      for (const date in response.data.near_earth_objects) {
        allAsteroids.push(...response.data.near_earth_objects[date]);
      }

      setAsteroids(allAsteroids);
      setFilteredAsteroids(allAsteroids);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch asteroids');
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await watchlistAPI.getWatchlist();
      setWatchlist(response.data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    }
  };

  const handleAddToWatchlist = async (asteroidId) => {
    try {
      await watchlistAPI.addToWatchlist(asteroidId);
      fetchWatchlist();
      alert('Added to watchlist!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to watchlist');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  };

  const isInWatchlist = (asteroidId) => {
    return watchlist.some(item => item.asteroidId === asteroidId);
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Asteroid Dashboard</h1>
          <p className="text-muted">Monitor near-Earth objects in real-time</p>
        </div>

        <div className="dashboard-controls card">
          <div className="dashboard-actions mb-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/earth')}
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              🌍 Launch Earth Viewer
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="date-filter">
            <div className="form-group">
              <label>Search Asteroids</label>
              <input
                type="text"
                className="input"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                className="input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Search
            </button>

            <button 
              type="button" 
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSearchQuery('');
                fetchData();
              }}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card card">
                <div className="stat-value">{filteredAsteroids.length}</div>
                <div className="stat-label">Asteroids Found</div>
              </div>
              <div className="stat-card card">
                <div className="stat-value">
                  {filteredAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length}
                </div>
                <div className="stat-label">Potentially Hazardous</div>
              </div>
              <div className="stat-card card">
                <div className="stat-value">{watchlist.length}</div>
                <div className="stat-label">In Watchlist</div>
              </div>
            </div>

            {/* Visualization Charts */}
            {filteredAsteroids.length > 0 && (
              <div className="charts-section">
                <h2 className="section-title">📊 Data Visualizations</h2>
                <div className="charts-grid">
                  <AsteroidChart asteroids={filteredAsteroids} type="risk-distribution" />
                  <AsteroidChart asteroids={filteredAsteroids} type="risk" />
                  <AsteroidChart asteroids={filteredAsteroids} type="velocity" />
                  <AsteroidChart asteroids={filteredAsteroids} type="size" />
                </div>
              </div>
            )}

            <h2 className="section-title">🌠 Asteroid Feed</h2>
            <div className="asteroids-grid grid grid-2">
              {filteredAsteroids.map((asteroid) => (
                <AsteroidCard
                  key={asteroid.id}
                  asteroid={asteroid}
                  onAddToWatchlist={handleAddToWatchlist}
                  isInWatchlist={isInWatchlist(asteroid.id)}
                />
              ))}
            </div>

            {filteredAsteroids.length === 0 && (
              <div className="empty-state">
                <p>No asteroids found matching your search criteria.</p>
              </div>
            )}
            
            <div className="dashboard-chat-section">
              <h2 className="section-title">💬 Global Community Chat</h2>
              <Chat asteroidId="general_chat" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
