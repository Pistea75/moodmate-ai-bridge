
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
      console.log("Starting clinician signup process...");
      
      // Sign up the user with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
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
      
      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        throw signUpError;
      }
      
      // Check if the user was created successfully
      if (data && data.user) {
        console.log('User created successfully:', data.user.id);
        
        // Success message
        toast({
          title: "Account created successfully",
          description: "Please check your email to confirm your account.",
        });
        
        // Navigate to login page or dashboard
        navigate('/login');
      } else {
        console.error('No user data returned from signup');
        throw new Error('Failed to create account. Please try again.');
      }
    } catch (err: any) {
      console.error('Error signing up:', err);
      
      // Provide more specific error messages based on common issues
      if (err.message.includes('User already registered')) {
        setError('This email is already registered. Please try logging in instead.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
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
