import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Logout function now handles redirect
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🌌</span>
            <span className="brand-text">Cosmic Watch</span>
          </Link>

          {isAuthenticated && (
            <div className="navbar-menu">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/how-it-works" className="nav-link">How It Works</Link>
              <Link to="/watchlist" className="nav-link">Watchlist</Link>
              <Link to="/alerts" className="nav-link">Alerts</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              
              <div className="navbar-user">
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
