import { useEffect, useState, useRef } from 'react';
import { useTutorial } from '../contexts/TutorialContext';
import { tutorialSteps } from '../data/tutorialSteps';
import './Tutorial.css';

const Tutorial = () => {
  const { activeTutorial, currentStep, nextStep, prevStep, skipTutorial, completeTutorial } = useTutorial();
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const steps = activeTutorial ? tutorialSteps[activeTutorial] : [];
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (!activeTutorial || !currentStepData) {
      setShowTooltip(false);
      return;
    }

    // Find target element
    const targetElement = document.querySelector(currentStepData.target);
    
    if (targetElement) {
      // Scroll target into view
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Calculate tooltip position
      setTimeout(() => {
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltipRef.current?.getBoundingClientRect();
        
        let top = 0;
        let left = 0;
        
        switch (currentStepData.position) {
          case 'top':
            top = rect.top - (tooltipRect?.height || 0) - 20;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - (tooltipRect?.width || 0) - 20;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 20;
            break;
          case 'center':
          default:
            top = window.innerHeight / 2;
            left = window.innerWidth / 2;
            break;
        }
        
        setTooltipPosition({ top, left });
        setShowTooltip(true);
      }, 300);
    } else {
      // If target not found, show in center
      setTooltipPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      });
      setShowTooltip(true);
    }
  }, [activeTutorial, currentStep, currentStepData]);

  if (!activeTutorial || !currentStepData) {
    return null;
  }

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextStep();
    }
  };

  const targetElement = currentStepData.target !== 'body' 
    ? document.querySelector(currentStepData.target) 
    : null;

  return (
    <>
      {/* Overlay */}
      <div className="tutorial-overlay" onClick={skipTutorial} />
      
      {/* Spotlight on target element */}
      {targetElement && (
        <div
          className="tutorial-spotlight"
          style={{
            top: targetElement.getBoundingClientRect().top - 10,
            left: targetElement.getBoundingClientRect().left - 10,
            width: targetElement.getBoundingClientRect().width + 20,
            height: targetElement.getBoundingClientRect().height + 20,
          }}
        />
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`tutorial-tooltip ${currentStepData.position}`}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div className="tooltip-header">
            <h3>{currentStepData.title}</h3>
            <button className="tooltip-close" onClick={skipTutorial} title="Skip tutorial">
              ×
            </button>
          </div>
          
          <div className="tooltip-content">
            <p>{currentStepData.content}</p>
          </div>
          
          <div className="tooltip-footer">
            <div className="step-indicator">
              {currentStep + 1} / {steps.length}
            </div>
            
            <div className="tooltip-actions">
              {!isFirstStep && (
                <button className="btn-secondary" onClick={prevStep}>
                  ← Previous
                </button>
              )}
              <button className="btn-primary" onClick={handleNext}>
                {isLastStep ? 'Finish ✓' : 'Next →'}
              </button>
            </div>
          </div>
          
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Tutorial;
