import React from 'react';
import './StepIndicator.css';

const STEPS = [
  { num: 1, label: 'Issue Type' },
  { num: 2, label: 'Sub-category' },
  { num: 3, label: 'Key Facts' },
  { num: 4, label: 'Legal Analysis' },
  { num: 5, label: 'Timeline' },
  { num: 6, label: 'Cost' },
  { num: 7, label: 'Actions' },
  { num: 8, label: 'Follow-Up' },
];

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="step-indicator">
      {STEPS.map((step) => (
        <div
          key={step.num}
          className={`step ${step.num <= currentStep ? 'active' : ''} ${step.num === currentStep ? 'current' : ''}`}
        >
          <div className="step-circle">
            {step.num < currentStep ? '✓' : step.num}
          </div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
