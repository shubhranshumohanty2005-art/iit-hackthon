import { useState } from 'react';
import { useTutorial } from '../contexts/TutorialContext';
import { availableTutorials } from '../data/tutorialSteps';
import './Tutorial.css';

const TutorialMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { startTutorial, isTutorialCompleted, resetTutorials } = useTutorial();

  const handleStartTutorial = (tutorialId) => {
    startTutorial(tutorialId);
    setShowMenu(false);
  };

  const handleResetTutorials = () => {
    if (window.confirm('Are you sure you want to reset all tutorial progress?')) {
      resetTutorials();
    }
  };

  return (
    <>
      {/* Floating Tutorial Button */}
      <button
        className="tutorial-start-btn"
        onClick={() => setShowMenu(true)}
        title="Start Tutorial"
      >
        🎓
      </button>

      {/* Tutorial Selection Menu */}
      {showMenu && (
        <div className="tutorial-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="tutorial-menu" onClick={(e) => e.stopPropagation()}>
            <h2>🎓 Interactive Tutorials</h2>
            <p className="tutorial-menu-subtitle">
              Choose a tutorial to learn how to use Cosmic Watch features
            </p>

            <div className="tutorial-list">
              {availableTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className={`tutorial-item ${isTutorialCompleted(tutorial.id) ? 'completed' : ''}`}
                  onClick={() => handleStartTutorial(tutorial.id)}
                >
                  <div className="tutorial-icon">{tutorial.icon}</div>
                  <div className="tutorial-info">
                    <p className="tutorial-name">{tutorial.name}</p>
                    <p className="tutorial-description">{tutorial.description}</p>
                  </div>
                  <div className="tutorial-meta">
                    <span className="tutorial-steps">{tutorial.steps} steps</span>
                    {isTutorialCompleted(tutorial.id) && (
                      <span className="tutorial-badge">✓ Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="tutorial-menu-footer">
              <button className="reset-tutorials-btn" onClick={handleResetTutorials}>
                🔄 Reset Progress
              </button>
              <button className="close-menu-btn" onClick={() => setShowMenu(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorialMenu;
