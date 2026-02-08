import { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';
import { useSound } from '../contexts/SoundContext';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [previousAlertCount, setPreviousAlertCount] = useState(0);
  const { playSound } = useSound();

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  // Play sound when new alerts arrive
  useEffect(() => {
    if (alerts.length > previousAlertCount && previousAlertCount > 0) {
      const newAlerts = alerts.slice(0, alerts.length - previousAlertCount);
      const hasCritical = newAlerts.some(a => a.severity === 'CRITICAL');
      const hasWarning = newAlerts.some(a => a.severity === 'WARNING');
      
      if (hasCritical) {
        playSound('alert');
      } else if (hasWarning) {
        playSound('warning');
      } else {
        playSound('notification');
      }
    }
    setPreviousAlertCount(alerts.length);
  }, [alerts]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await alertsAPI.getAlerts(filter === 'unread');
      setAlerts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await alertsAPI.markAsRead(id);
      fetchAlerts();
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this alert?')) return;

    try {
      await alertsAPI.deleteAlert(id);
      fetchAlerts();
    } catch (err) {
      alert('Failed to delete alert');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await alertsAPI.markAllAsRead();
      fetchAlerts();
    } catch (err) {
      alert('Failed to mark all as read');
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'alert-critical';
      case 'WARNING':
        return 'alert-warning';
      default:
        return 'alert-info';
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
    <div className="alerts-page">
      <div className="container">
        <div className="alerts-header">
          <h1>Alerts</h1>
          <p className="text-muted">Stay updated on your monitored asteroids</p>
        </div>

        <div className="alerts-controls card">
          <div className="filter-buttons">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All Alerts
            </button>
            <button
              className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('unread')}
            >
              Unread Only
            </button>
          </div>

          {alerts.some(a => !a.isRead) && (
            <button onClick={handleMarkAllAsRead} className="btn btn-secondary">
              Mark All as Read
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {alerts.length === 0 ? (
          <div className="empty-state card">
            <h2>No alerts</h2>
            <p>You'll be notified here when there are updates to your watched asteroids</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`alert-item card ${getSeverityClass(alert.severity)} ${
                  !alert.isRead ? 'alert-unread' : ''
                }`}
              >
                <div className="alert-content">
                  <div className="alert-header">
                    <h3>{alert.asteroidName}</h3>
                    <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <p className="alert-message">{alert.message}</p>

                  <div className="alert-meta">
                    <span className="alert-type">{alert.alertType.replace('_', ' ')}</span>
                    <span className="alert-date">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="alert-actions">
                  {!alert.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(alert._id)}
                      className="btn btn-secondary btn-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(alert._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
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

export default Alerts;
