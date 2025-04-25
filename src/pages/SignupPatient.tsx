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
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      interface UserMetadata {
        first_name: string;
        last_name: string;
        language: string;
        role: string;
        referral_code?: string;
      }
      
      const metadata: UserMetadata = {
        first_name: firstName,
        last_name: lastName || '',
        language: formData.language,
        role: 'patient',
      };
      
      if (formData.referralCode.trim()) {
        metadata.referral_code = formData.referralCode.trim();
      }
      
      console.log("Attempting patient signup with metadata:", metadata);
      
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
