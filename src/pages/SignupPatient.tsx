
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/auth/AuthFormLayout';
import { StepIndicator } from '../components/auth/StepIndicator';
import { SignupForm } from '../components/auth/SignupForm';
import { PatientSignupStep2 } from '../components/auth/patient/PatientSignupStep2';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export default function SignupPatient() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    referralCode: '',
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
      console.log("Starting patient signup with data:", {
        email: formData.email,
        fullName: formData.fullName,
        language: formData.language,
        referralCode: formData.referralCode
      });
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            language: formData.language,
            role: 'patient',
            referral_code: formData.referralCode || null
          }
        }
      });
      
      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        throw signUpError;
      }
      
      if (data && data.user) {
        console.log('User created successfully with ID:', data.user.id);
        console.log('User metadata:', data.user.user_metadata);
        
        // Update users table with the new user
        if (formData.referralCode) {
          await supabase
            .from('users')
            .update({ 
              name: formData.referralCode.toUpperCase(),
              email: formData.email,
              role: 'patient',
              language: formData.language
            })
            .eq('id', data.user.id);
        } else {
          await supabase
            .from('users')
            .update({ 
              name: formData.fullName,
              email: formData.email,
              role: 'patient',
              language: formData.language
            })
            .eq('id', data.user.id);
        }
        
        toast({
          title: "Account created successfully",
          description: "Please check your email to confirm your account.",
        });
        
        navigate('/login');
      } else {
        console.error('No user data returned from signup');
        throw new Error('Failed to create account. Please try again.');
      }
    } catch (err: any) {
      console.error('Full error object:', err);
      
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
      title="Join as a Patient"
      subtitle="Create your account to get started with MoodMate"
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
          <PatientSignupStep2 
            formData={formData} 
            handleChange={handleChange} 
          />
        )}
      />
    </AuthFormLayout>
  );
}
