import { useState, useEffect } from 'react';
import './Help.css';

const Help = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('quick-start');

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const helpSections = {
    'quick-start': {
      title: '🚀 Quick Start',
      content: (
        <>
          <h3>Get Started in 3 Steps</h3>
          <ol>
            <li>
              <strong>Get NASA API Key</strong>
              <p>Visit <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer">api.nasa.gov</a> for a free key</p>
            </li>
            <li>
              <strong>Configure Environment</strong>
              <p>Add your API key to <code>backend/.env</code></p>
            </li>
            <li>
              <strong>Run the App</strong>
              <p>Double-click <code>run.bat</code> or run it in terminal</p>
            </li>
          </ol>
          <div className="info-box">
            <strong>Access URLs:</strong>
            <ul>
              <li>Frontend: <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">localhost:3000</a></li>
              <li>Backend: <a href="http://localhost:5001" target="_blank" rel="noopener noreferrer">localhost:5001</a></li>
            </ul>
          </div>
          <div className="info-box" style={{marginTop: '16px'}}>
            <strong>📖 Want to learn more?</strong>
            <p style={{margin: '8px 0 0 0'}}>
              Check out the <a href="/how-it-works">How It Works</a> page for detailed architecture and workflow information!
            </p>
          </div>
        </>
      ),
    },
    'features': {
      title: '✨ Features',
      content: (
        <>
          <h3>What You Can Do</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon">🌠</span>
              <h4>Dashboard</h4>
              <p>View and search asteroid data from NASA</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <h4>Asteroid Details</h4>
              <p>Comprehensive orbital and physical data</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <h4>Watchlist</h4>
              <p>Track your favorite asteroids</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <h4>Alerts</h4>
              <p>Get notified about close approaches</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <h4>Charts</h4>
              <p>Interactive data visualizations</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌍</span>
              <h4>Earth Viewer</h4>
              <p>3D Earth visualization with Three.js</p>
            </div>
          </div>
        </>
      ),
    },
    'faq': {
      title: '❓ FAQ',
      content: (
        <>
          <h3>Common Questions</h3>
          <div className="faq-item">
            <strong>How do I add an asteroid to my watchlist?</strong>
            <p>Click "View Details" on any asteroid, then click "Add to Watchlist"</p>
          </div>
          <div className="faq-item">
            <strong>What do the risk levels mean?</strong>
            <p>
              🔴 CRITICAL (≥75) • 🟠 HIGH (50-74) • 🟡 MEDIUM (25-49) • 🟢 LOW (&lt;25)
            </p>
          </div>
          <div className="faq-item">
            <strong>How often are alerts checked?</strong>
            <p>The system automatically checks watched asteroids every 6 hours</p>
          </div>
          <div className="faq-item">
            <strong>Why isn't asteroid data showing?</strong>
            <p>Check that your NASA API key is configured in backend/.env and restart the server</p>
          </div>
          <div className="faq-item">
            <strong>How do I stop the servers?</strong>
            <p>Run <code>stop.bat</code> or close the terminal windows</p>
          </div>
        </>
      ),
    },
    'troubleshooting': {
      title: '🛠️ Troubleshooting',
      content: (
        <>
          <h3>Common Issues</h3>
          <div className="troubleshoot-item">
            <strong>❌ "Cannot connect to backend"</strong>
            <ul>
              <li>Verify backend is running on port 5001</li>
              <li>Check REACT_APP_API_URL in frontend/.env</li>
              <li>Restart both servers</li>
            </ul>
          </div>
          <div className="troubleshoot-item">
            <strong>❌ "MongoDB connection failed"</strong>
            <ul>
              <li>Start MongoDB: <code>net start MongoDB</code></li>
              <li>Check it's running on port 27017</li>
              <li>Verify MONGODB_URI in backend/.env</li>
            </ul>
          </div>
          <div className="troubleshoot-item">
            <strong>❌ "NASA API error: 403"</strong>
            <ul>
              <li>Verify API key in backend/.env</li>
              <li>Check for extra spaces or quotes</li>
              <li>Get a new key from api.nasa.gov</li>
              <li>Restart backend server</li>
            </ul>
          </div>
          <div className="troubleshoot-item">
            <strong>❌ "Port already in use"</strong>
            <ul>
              <li>Run <code>stop.bat</code> to kill all node processes</li>
              <li>Or run <code>kill-port.bat</code></li>
            </ul>
          </div>
        </>
      ),
    },
    'docs': {
      title: '📚 Documentation',
      content: (
        <>
          <h3>Available Guides</h3>
          <div className="docs-list">
            <a href="/HELP.md" target="_blank" className="doc-link">
              <span className="doc-icon">📖</span>
              <div>
                <strong>Complete Help Guide</strong>
                <p>Comprehensive documentation with all features</p>
              </div>
            </a>
            <a href="/USER-GUIDE.md" target="_blank" className="doc-link">
              <span className="doc-icon">👤</span>
              <div>
                <strong>User Guide</strong>
                <p>Account creation and getting started</p>
              </div>
            </a>
            <a href="/API_KEY_GUIDE.md" target="_blank" className="doc-link">
              <span className="doc-icon">🔑</span>
              <div>
                <strong>API Key Setup</strong>
                <p>Configure your NASA API key</p>
              </div>
            </a>
            <a href="/RUNNING-GUIDE.md" target="_blank" className="doc-link">
              <span className="doc-icon">🚀</span>
              <div>
                <strong>Running Guide</strong>
                <p>How to start the application</p>
              </div>
            </a>
            <a href="/TESTING_GUIDE.md" target="_blank" className="doc-link">
              <span className="doc-icon">🧪</span>
              <div>
                <strong>Testing Guide</strong>
                <p>API testing with Postman</p>
              </div>
            </a>
            <a href="/README.md" target="_blank" className="doc-link">
              <span className="doc-icon">📄</span>
              <div>
                <strong>README</strong>
                <p>Project overview and technical details</p>
              </div>
            </a>
          </div>
        </>
      ),
    },
  };

  return (
    <>
      {/* Floating Help Button */}
      <button
        className="help-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Help"
        title="Need Help? Click here!"
      >
        <span className="help-icon">?</span>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="help-overlay" onClick={() => setIsOpen(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="help-header">
              <h2>🌌 Cosmic Watch Help</h2>
              <button
                className="help-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Help"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="help-content">
              {/* Sidebar */}
              <div className="help-sidebar">
                {Object.entries(helpSections).map(([key, section]) => (
                  <button
                    key={key}
                    className={`help-nav-item ${activeSection === key ? 'active' : ''}`}
                    onClick={() => setActiveSection(key)}
                  >
                    {section.title}
                  </button>
                ))}
              </div>

              {/* Main Content */}
              <div className="help-main">
                {helpSections[activeSection].content}
              </div>
            </div>

            {/* Footer */}
            <div className="help-footer">
              <p>
                <strong>Still need help?</strong> Check the{' '}
                <a href="/HELP.md" target="_blank" rel="noopener noreferrer">
                  complete documentation
                </a>
                {' '}or press <kbd>F12</kbd> to check the browser console for errors.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Help;
