
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";

interface TooltipStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: TooltipStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Dashboard!',
    description: 'This is your practice overview. Here you can see all your key metrics and patient information.',
    target: 'dashboard-header',
    position: 'bottom',
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'Use these buttons for common tasks like scheduling sessions and adding patient tasks.',
    target: 'quick-actions',
    position: 'top',
  },
  {
    id: 'notifications',
    title: 'Stay Updated',
    description: 'Keep track of important alerts, upcoming sessions, and patient messages here.',
    target: 'notifications',
    position: 'left',
  },
  {
    id: 'patient-spotlight',
    title: 'Patient Insights',
    description: 'View detailed mood charts and progress for individual patients.',
    target: 'patient-spotlight',
    position: 'top',
  },
];

export function OnboardingTooltips() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const seen = localStorage.getItem('clinician-onboarding-seen');
    if (!seen) {
      setIsVisible(true);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    setHasSeenOnboarding(true);
    localStorage.setItem('clinician-onboarding-seen', 'true');
  };

  const handleSkip = () => {
    handleFinish();
  };

  const resetOnboarding = () => {
    localStorage.removeItem('clinician-onboarding-seen');
    setHasSeenOnboarding(false);
    setCurrentStep(0);
    setIsVisible(true);
  };

  if (!isVisible) {
    return hasSeenOnboarding ? (
      <Button
        variant="outline"
        size="sm"
        onClick={resetOnboarding}
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        Show Tutorial
      </Button>
    ) : null;
  }

  const currentStepData = onboardingSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tooltip */}
      <Card className="fixed z-50 max-w-sm bg-white shadow-xl" style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">{currentStepData.title}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            {currentStepData.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < onboardingSteps.length - 1 && (
                  <ArrowRight className="h-3 w-3 ml-1" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Step {currentStep + 1} of {onboardingSteps.length}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
