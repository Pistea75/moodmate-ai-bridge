
import { BasicInfoStep } from './signup/BasicInfoStep';
import { FormActions } from './signup/FormActions';

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  language: string;
  acceptTerms: boolean;
  [key: string]: string | boolean;
}

interface SignupFormProps {
  formData: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  step: number;
  setStep: (step: number) => void;
  isLoading: boolean;
  renderStep2Fields: () => JSX.Element;
  error?: string;
}

export function SignupForm({ 
  formData, 
  handleChange, 
  handleSubmit, 
  step,
  setStep,
  isLoading,
  renderStep2Fields,
  error
}: SignupFormProps) {
  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };
  
  const passwordError = validatePassword();
  const showPasswordError = Boolean(formData.password && formData.confirmPassword && passwordError);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <BasicInfoStep 
            formData={formData}
            handleChange={handleChange}
            error={error}
          />
        ) : (
          renderStep2Fields()
        )}
        
        <FormActions 
          step={step}
          setStep={setStep}
          isLoading={isLoading}
          showPasswordError={showPasswordError}
        />
      </form>
    </div>
  );
}
