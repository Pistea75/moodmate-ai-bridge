
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/auth/AuthFormLayout';
import { StepIndicator } from '../components/auth/StepIndicator';
import { SignupForm } from '../components/auth/SignupForm';
import { ClinicianSignupStep2 } from '../components/auth/clinician/ClinicianSignupStep2';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { toast } from '@/hooks/use-toast';
import { validatePasswordStrength } from '@/utils/enhancedSecurityUtils';

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
      
      // Use enhanced password validation
      const passwordValidation = validatePasswordStrength(formData.password);
      if (!passwordValidation.isValid) {
        toast({
          title: "Password Requirements Not Met",
          description: passwordValidation.errors.join('. '),
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
    
    try {
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      interface UserMetadata {
        first_name: string;
        last_name: string;
        language: string;
        role: string;
        specialization: string;
        license_number: string;
      }
      
      const metadata: UserMetadata = {
        first_name: firstName,
        last_name: lastName || '',
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
