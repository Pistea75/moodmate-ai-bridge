
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <>
            <div
              key={`step-${index}`}
              className={`
                h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm
                ${currentStep >= index + 1 ? 'bg-mood-purple text-white' : 'bg-muted text-muted-foreground'}
              `}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                key={`line-${index}`}
                className={`w-12 h-1 ${currentStep > index + 1 ? 'bg-mood-purple' : 'bg-muted'}`}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
