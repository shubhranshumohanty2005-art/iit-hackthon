import React, { createContext, useContext, useState, useEffect } from 'react';

const TutorialContext = createContext();

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};

export const TutorialProvider = ({ children }) => {
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTutorials, setCompletedTutorials] = useState([]);

  // Load completed tutorials from localStorage
  useEffect(() => {
    const completed = localStorage.getItem('completedTutorials');
    if (completed) {
      setCompletedTutorials(JSON.parse(completed));
    }
  }, []);

  const startTutorial = (tutorialName) => {
    setActiveTutorial(tutorialName);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const skipTutorial = () => {
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  const completeTutorial = () => {
    if (activeTutorial && !completedTutorials.includes(activeTutorial)) {
      const updated = [...completedTutorials, activeTutorial];
      setCompletedTutorials(updated);
      localStorage.setItem('completedTutorials', JSON.stringify(updated));
    }
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  const isTutorialCompleted = (tutorialName) => {
    return completedTutorials.includes(tutorialName);
  };

  const resetTutorials = () => {
    setCompletedTutorials([]);
    localStorage.removeItem('completedTutorials');
  };

  const value = {
    activeTutorial,
    currentStep,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial,
    isTutorialCompleted,
    resetTutorials,
  };

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
};
