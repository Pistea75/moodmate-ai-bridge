
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/auth/AuthFormLayout';
import { StepIndicator } from '../components/auth/StepIndicator';
import { SignupForm } from '../components/auth/SignupForm';
import { ClinicianSignupStep2 } from '../components/auth/clinician/ClinicianSignupStep2';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { toast } from '@/hooks/use-toast';

export default function SignupClinician() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    specialization: '',
    licenseNumber: '',
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

    if (!formData.specialization) {
      toast({
        title: "Error",
        description: "Please select your specialization",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.licenseNumber) {
      toast({
        title: "Error",
        description: "Please enter your license number",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create metadata object for clinician signup
      const metadata = {
        full_name: formData.fullName.trim(),
        language: formData.language,
        role: 'clinician',
        specialization: formData.specialization,
        license_number: formData.licenseNumber.trim()
      };
      
      console.log("Attempting clinician signup with metadata:", metadata);
      
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
        error={error?.message}
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
