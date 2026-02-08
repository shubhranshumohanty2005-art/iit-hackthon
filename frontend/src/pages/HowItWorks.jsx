import React, { useState } from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="how-it-works-container">
      <div className="container">
        <header className="page-header">
          <h1 className="gradient-text">🔍 How Cosmic Watch Works</h1>
          <p className="subtitle">
            Understand the architecture, workflow, and technology behind your asteroid monitoring platform
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            🏗️ Architecture
          </button>
          <button
            className={`tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            🔄 Workflow
          </button>
          <button
            className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            ✨ Features
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>System Overview</h2>
              <p className="intro-text">
                Cosmic Watch is a full-stack MERN application that monitors Near-Earth Objects (NEOs) 
                using NASA's NeoWs API. The system provides real-time tracking, risk analysis, and 
                personalized alerts for potentially hazardous asteroids.
              </p>

              <div className="overview-grid">
                <div className="overview-card">
                  <div className="card-icon">🎯</div>
                  <h3>Purpose</h3>
                  <p>Monitor and track Near-Earth asteroids in real-time using NASA data</p>
                </div>
                <div className="overview-card">
                  <div className="card-icon">🛡️</div>
                  <h3>Risk Analysis</h3>
                  <p>Intelligent scoring system based on hazard level, distance, size, and velocity</p>
                </div>
                <div className="overview-card">
                  <div className="card-icon">🔔</div>
                  <h3>Alerts</h3>
                  <p>Automated monitoring with cron jobs checking every 6 hours</p>
                </div>
                <div className="overview-card">
                  <div className="card-icon">📊</div>
                  <h3>Visualization</h3>
                  <p>Interactive charts and 3D Earth viewer with Three.js</p>
                </div>
              </div>

              <div className="tech-stack-section">
                <h3>Technology Stack</h3>
                <div className="tech-columns">
                  <div className="tech-column">
                    <h4>Frontend</h4>
                    <ul>
                      <li>⚛️ React 18</li>
                      <li>⚡ Vite</li>
                      <li>🧭 React Router v6</li>
                      <li>📊 Chart.js</li>
                      <li>🌍 Three.js</li>
                    </ul>
                  </div>
                  <div className="tech-column">
                    <h4>Backend</h4>
                    <ul>
                      <li>🟢 Node.js 18</li>
                      <li>🚂 Express.js</li>
                      <li>🍃 MongoDB 7</li>
                      <li>🔐 JWT + bcrypt</li>
                      <li>🔌 Socket.io</li>
                    </ul>
                  </div>
                  <div className="tech-column">
                    <h4>External APIs</h4>
                    <ul>
                      <li>🛰️ NASA NeoWs API</li>
                      <li>🌐 Axios HTTP client</li>
                      <li>⏰ node-cron scheduler</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="architecture-section">
              <h2>System Architecture</h2>
              
              <div className="architecture-diagram">
                <div className="arch-layer">
                  <h4>Frontend Layer</h4>
                  <div className="arch-boxes">
                    <div className="arch-box">React App</div>
                    <div className="arch-box">Auth Context</div>
                    <div className="arch-box">API Service</div>
                  </div>
                </div>
                
                <div className="arch-arrow">⬇️</div>
                
                <div className="arch-layer">
                  <h4>Backend Layer</h4>
                  <div className="arch-boxes">
                    <div className="arch-box">Express Server</div>
                    <div className="arch-box">Auth Middleware</div>
                    <div className="arch-box">API Routes</div>
                  </div>
                </div>
                
                <div className="arch-arrow">⬇️</div>
                
                <div className="arch-layer">
                  <h4>Service Layer</h4>
                  <div className="arch-boxes">
                    <div className="arch-box">NASA Service</div>
                    <div className="arch-box">Risk Analysis</div>
                    <div className="arch-box">Alert Service</div>
                  </div>
                </div>
                
                <div className="arch-arrow">⬇️</div>
                
                <div className="arch-layer">
                  <h4>Data Layer</h4>
                  <div className="arch-boxes">
                    <div className="arch-box">MongoDB</div>
                    <div className="arch-box">NASA API</div>
                  </div>
                </div>
              </div>

              <div className="component-breakdown">
                <h3>Key Components</h3>
                <div className="component-list">
                  <div className="component-item">
                    <strong>🎨 Frontend Components:</strong>
                    <p>React components for Dashboard, Asteroid Details, Watchlist, Alerts, Profile, and Earth Viewer</p>
                  </div>
                  <div className="component-item">
                    <strong>🔧 Backend Controllers:</strong>
                    <p>Handle authentication, asteroid data retrieval, watchlist management, and alert generation</p>
                  </div>
                  <div className="component-item">
                    <strong>💾 Database Models:</strong>
                    <p>User schema, Watchlist schema, and Alert schema with MongoDB</p>
                  </div>
                  <div className="component-item">
                    <strong>⚙️ Services:</strong>
                    <p>NASA API integration, risk scoring algorithm, and automated alert checking with cron</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="workflow-section">
              <h2>Application Workflow</h2>

              <div className="workflow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>User Authentication</h3>
                  <p>User registers or logs in → JWT token generated → Token stored in localStorage → Protected routes accessible</p>
                  <code>POST /api/auth/register or /api/auth/login</code>
                </div>
              </div>

              <div className="workflow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Fetch Asteroid Data</h3>
                  <p>Frontend requests asteroid feed → Backend calls NASA NeoWs API → Data processed and enriched with risk scores → Returned to frontend</p>
                  <code>GET /api/asteroids/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD</code>
                </div>
              </div>

              <div className="workflow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Risk Analysis</h3>
                  <p>System calculates risk score based on: Hazardous status (40%), Miss distance (30%), Diameter (20%), Velocity (10%)</p>
                  <div className="risk-formula">
                    <strong>Risk Score = </strong>
                    <span className="formula-part">Hazard Points + Distance Points + Size Points + Speed Points</span>
                  </div>
                </div>
              </div>

              <div className="workflow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Watchlist Management</h3>
                  <p>User adds asteroid to watchlist → Stored in MongoDB with user ID → Alert preferences configured → System tracks for updates</p>
                  <code>POST /api/watchlist (body: &#123;asteroidId, alertEnabled&#125;)</code>
                </div>
              </div>

              <div className="workflow-step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>Automated Alerts</h3>
                  <p>Cron job runs every 6 hours → Checks all watchlisted asteroids → Compares with NASA data → Creates alerts for changes → Notifications sent to users</p>
                  <code>Cron: "0 */6 * * *" (every 6 hours)</code>
                </div>
              </div>

              <div className="workflow-step">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h3>Data Visualization</h3>
                  <p>Chart.js renders 4 interactive charts → Three.js powers 3D Earth viewer → Real-time updates on data changes</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="features-section">
              <h2>Feature Deep Dive</h2>

              <div className="feature-detail">
                <h3>🌠 Dashboard</h3>
                <p><strong>How it works:</strong> Fetches asteroid data from NASA API for selected date range, applies risk scoring algorithm, displays in card format with search/filter capabilities.</p>
                <p><strong>Technologies:</strong> React hooks (useState, useEffect), Axios, NASA NeoWs API</p>
              </div>

              <div className="feature-detail">
                <h3>🔍 Asteroid Details</h3>
                <p><strong>How it works:</strong> Retrieves detailed orbital data for specific asteroid ID, displays physical characteristics, close approach history, and risk analysis.</p>
                <p><strong>Technologies:</strong> React Router params, NASA API lookup endpoint</p>
              </div>

              <div className="feature-detail">
                <h3>⭐ Watchlist</h3>
                <p><strong>How it works:</strong> Stores user-asteroid relationships in MongoDB, allows alert configuration, provides quick access to tracked asteroids.</p>
                <p><strong>Technologies:</strong> MongoDB schemas, JWT authentication, RESTful API</p>
              </div>

              <div className="feature-detail">
                <h3>🔔 Alert System</h3>
                <p><strong>How it works:</strong> Background cron job queries NASA API for watchlisted asteroids, compares data, generates alerts on changes (approach date, risk level, etc.).</p>
                <p><strong>Technologies:</strong> node-cron, MongoDB queries, async processing</p>
              </div>

              <div className="feature-detail">
                <h3>📊 Data Visualizations</h3>
                <p><strong>How it works:</strong> Aggregates asteroid data, processes into chart-friendly format, renders using Chart.js with responsive design.</p>
                <p><strong>Technologies:</strong> Chart.js, react-chartjs-2, data transformation algorithms</p>
              </div>

              <div className="feature-detail">
                <h3>🌍 Earth Viewer</h3>
                <p><strong>How it works:</strong> Creates 3D scene with Three.js, renders Earth with textures, plots asteroid positions in orbital space, interactive camera controls.</p>
                <p><strong>Technologies:</strong> Three.js, WebGL, OrbitControls, animation loops</p>
              </div>

              <div className="feature-detail">
                <h3>🔐 Authentication</h3>
                <p><strong>How it works:</strong> User credentials hashed with bcrypt, JWT token generated on login, token validated on protected routes, stored in localStorage.</p>
                <p><strong>Technologies:</strong> bcrypt (10 salt rounds), jsonwebtoken, Express middleware</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
