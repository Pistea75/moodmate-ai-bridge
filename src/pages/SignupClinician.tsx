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
    firstName: '',
    lastName: '',
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
    
    if (error) setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
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
    
    if (!formData.acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            language: formData.language,
            role: 'clinician',
            specialization: formData.specialization,
            license_number: formData.licenseNumber
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created successfully",
        description: "You can now log in to your account.",
      });
      
      navigate('/clinician/dashboard');
    } catch (err) {
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
