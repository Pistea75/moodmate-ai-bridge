import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/auth/AuthFormLayout';
import { StepIndicator } from '../components/auth/StepIndicator';
import { SignupForm } from '../components/auth/SignupForm';
import { PatientSignupStep2 } from '../components/auth/patient/PatientSignupStep2';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { toast } from '@/hooks/use-toast';

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
  
  const navigate = useNavigate();
  const { isLoading, error, signUp, clearError } = useAuthFlow();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (error) clearError();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        return;
      }
      
      setStep(2);
      return;
    }
    
    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "You must accept the Terms of Service and Privacy Policy",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const metadata = {
        full_name: formData.fullName.trim(),
        language: formData.language,
        role: 'patient',
        ...(formData.referralCode.trim() ? { referral_code: formData.referralCode.trim().toUpperCase() } : {})
      };
      
      console.log("Attempting signup with metadata:", metadata);
      
      const success = await signUp(formData.email.trim(), formData.password, metadata);
      
      if (success) {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account."
        });
        navigate('/login');
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      
      if (!err.message?.includes('Database error')) {
        return;
      }
      
      toast({
        title: "Registration Error",
        description: "There was a problem creating your account. Please try again later.",
        variant: "destructive"
      });
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
        error={error?.message}
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
