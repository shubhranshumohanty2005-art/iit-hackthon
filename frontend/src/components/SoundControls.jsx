import { useState } from 'react';
import { useSound } from '../contexts/SoundContext';
import './SoundControls.css';

const SoundControls = () => {
  const { soundEnabled, volume, playSound, toggleSound, updateVolume } = useSound();
  const [showControls, setShowControls] = useState(false);

  const handleVolumeChange = (e) => {
    updateVolume(parseFloat(e.target.value));
  };

  const handleTestSound = (type) => {
    playSound(type);
  };

  return (
    <>
      {/* Floating Sound Button */}
      <button
        className="sound-control-btn"
        onClick={() => setShowControls(!showControls)}
        title={soundEnabled ? 'Sound Enabled' : 'Sound Disabled'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      {/* Sound Controls Panel */}
      {showControls && (
        <>
          <div className="sound-overlay" onClick={() => setShowControls(false)} />
          <div className="sound-controls-panel">
            <div className="sound-header">
              <h3>🔊 Sound Settings</h3>
              <button className="close-btn" onClick={() => setShowControls(false)}>×</button>
            </div>

            <div className="sound-content">
              {/* Enable/Disable Toggle */}
              <div className="control-group">
                <label className="toggle-label">
                  <span>Sound Alerts</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={toggleSound}
                    />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>

              {/* Volume Control */}
              {soundEnabled && (
                <div className="control-group">
                  <label>
                    <span>Volume</span>
                    <div className="volume-control">
                      <span className="volume-icon">🔉</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                      />
                      <span className="volume-value">{Math.round(volume * 100)}%</span>
                    </div>
                  </label>
                </div>
              )}

              {/* Test Sounds */}
              {soundEnabled && (
                <div className="control-group">
                  <label>Test Sounds</label>
                  <div className="test-buttons">
                    <button onClick={() => handleTestSound('alert')} className="test-btn alert">
                      🚨 Alert
                    </button>
                    <button onClick={() => handleTestSound('notification')} className="test-btn notification">
                      🔔 Notification
                    </button>
                    <button onClick={() => handleTestSound('warning')} className="test-btn warning">
                      ⚠️ Warning
                    </button>
                    <button onClick={() => handleTestSound('success')} className="test-btn success">
                      ✓ Success
                    </button>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="sound-info">
                <p>
                  Sound alerts will play when:
                </p>
                <ul>
                  <li>New asteroid alerts are received</li>
                  <li>High-risk asteroids are detected</li>
                  <li>Watchlist items have updates</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SoundControls;
