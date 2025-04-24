
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  step: number;
  setStep: (step: number) => void;
  isLoading: boolean;
  showPasswordError?: boolean;
}

export function FormActions({ step, setStep, isLoading, showPasswordError }: FormActionsProps) {
  return (
    <>
      <div className="mt-6 flex gap-3">
        {step === 2 && (
          <Button
            type="button"
            onClick={() => setStep(1)}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || (step === 1 && showPasswordError)}
          className="flex-1"
        >
          {step === 1 ? 'Continue' : isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-mood-purple hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
