import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    // TODO: Implement profile update API call
    alert('Profile update feature coming soon!');
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>👤 User Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-card card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            <div className="profile-info">
              {!isEditing ? (
                <>
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{user?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Member Since:</span>
                    <span className="info-value">
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                    Edit Profile
                  </button>
                  <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSave} className="btn btn-primary">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Asteroids Tracked</div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Active Alerts</div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">🔔</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Notifications</div>
            </div>
          </div>

          <div className="settings-card card">
            <h2>⚙️ Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div>
                  <div className="setting-title">Email Notifications</div>
                  <div className="setting-description">Receive alerts via email</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div>
                  <div className="setting-title">Risk Threshold</div>
                  <div className="setting-description">Minimum risk level for alerts</div>
                </div>
                <select className="input" style={{ width: '150px' }}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="setting-item">
                <div>
                  <div className="setting-title">Auto-Watch Hazardous</div>
                  <div className="setting-description">Automatically watch hazardous asteroids</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
