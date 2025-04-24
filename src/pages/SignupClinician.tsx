
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/auth/AuthFormLayout';
import { StepIndicator } from '../components/auth/StepIndicator';
import { SignupForm } from '../components/auth/SignupForm';
import { ClinicianSignupStep2 } from '../components/auth/clinician/ClinicianSignupStep2';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing again
    if (error) setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate passwords
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      setStep(2);
      return;
    }
    
    // Step 2 submission - create account
    if (!formData.acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }
    
    if (!formData.specialization) {
      setError('Please select your specialization');
      return;
    }
    
    if (!formData.licenseNumber) {
      setError('Please enter your license number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            language: formData.language,
            role: 'clinician',
            specialization: formData.specialization,
            license_number: formData.licenseNumber
          }
        }
      });
      
      if (error) throw error;
      
      // Success
      toast({
        title: "Account created successfully",
        description: "You can now log in to your account.",
      });
      
      // Redirect to dashboard or confirmation page
      navigate('/clinician/dashboard');
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout 
      title="Join as a Clinician"
      subtitle="Create your account to start using MoodMate for your practice"
    >
      <StepIndicator currentStep={step} totalSteps={2} />
      <SignupForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        error={error}
        renderStep2Fields={() => (
          <ClinicianSignupStep2 
            formData={formData} 
            handleChange={handleChange} 
          />
        )}
      />
    </AuthFormLayout>
  );
}
