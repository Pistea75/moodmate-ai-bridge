
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center items-center gap-2 mb-8">
      {steps.map((step) => (
        <React.Fragment key={`step-${step}`}>
          <div
            className={`h-2 w-2 rounded-full ${
              step <= currentStep ? 'bg-mood-purple' : 'bg-gray-300'
            }`}
          />
          {step < totalSteps && (
            <div
              className={`h-0.5 w-4 ${
                step < currentStep ? 'bg-mood-purple' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
