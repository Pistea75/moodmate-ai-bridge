
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SignupFormData {
  name: string;
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
  isLoading: boolean;
  renderStep2Fields: () => JSX.Element;
}

export function SignupForm({ 
  formData, 
  handleChange, 
  handleSubmit, 
  step, 
  isLoading,
  renderStep2Fields 
}: SignupFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
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
                placeholder="Your name"
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
  );
}
