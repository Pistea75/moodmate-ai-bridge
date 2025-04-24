import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const showPasswordError = formData.password && formData.confirmPassword && passwordError;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple ${showPasswordError ? 'border-red-500' : ''}`}
                placeholder="Create a password"
              />
              {formData.password && formData.password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple ${showPasswordError ? 'border-red-500' : ''}`}
                placeholder="Confirm password"
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-1">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        ) : (
          renderStep2Fields()
        )}
        
        <div className="mt-6 flex gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-2.5 rounded-lg font-medium border border-mood-purple text-mood-purple hover:bg-mood-purple-light"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || (step === 1 && !!showPasswordError)}
            className={`
              flex-1 py-2.5 rounded-lg font-medium text-white
              ${(isLoading || (step === 1 && !!showPasswordError))
                ? 'bg-mood-purple/70 cursor-not-allowed' 
                : 'bg-mood-purple hover:bg-mood-purple-secondary'
              }
            `}
          >
            {step === 1 ? 'Continue' : isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-mood-purple hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
