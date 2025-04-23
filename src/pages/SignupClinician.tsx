
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export default function SignupClinician() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    specialization: '',
    licenseNumber: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd handle auth logic with your backend
      setIsLoading(false);
      window.location.href = '/clinician/dashboard';
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Join as a Clinician</h1>
            <p className="text-muted-foreground mt-2">
              Create your account to start using MoodMate for your practice
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`
                h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm
                ${step >= 1 ? 'bg-mood-purple text-white' : 'bg-muted text-muted-foreground'}
              `}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-mood-purple' : 'bg-muted'}`}></div>
              <div className={`
                h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm
                ${step >= 2 ? 'bg-mood-purple text-white' : 'bg-muted text-muted-foreground'}
              `}>
                2
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                // Step 1: Basic Info
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
                      placeholder="Dr. Jane Smith"
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
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
                      placeholder="Create a password"
                    />
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
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
                      placeholder="Confirm password"
                    />
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
                // Step 2: Professional Info
                <div className="space-y-4">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium mb-1">
                      Specialization
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
                    >
                      <option value="">Select specialization</option>
                      <option value="psychiatrist">Psychiatrist</option>
                      <option value="psychologist">Psychologist</option>
                      <option value="therapist">Therapist</option>
                      <option value="counselor">Counselor</option>
                      <option value="social-worker">Social Worker</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
                      placeholder="Your professional license number"
                    />
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                    <label htmlFor="acceptTerms" className="ml-2 text-sm">
                      I agree to MoodMate's{' '}
                      <Link to="/terms" className="text-mood-purple hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-mood-purple hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Once your account is created, you'll be able to generate custom referral codes for your patients.
                    </p>
                  </div>
                </div>
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
                  disabled={isLoading}
                  className={`
                    flex-1 py-2.5 rounded-lg font-medium text-white
                    ${isLoading 
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
        </div>
      </div>
    </MainLayout>
  );
}
