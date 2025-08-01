
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/auth/AuthFormLayout';
import { StepIndicator } from '../components/auth/StepIndicator';
import { SignupForm } from '../components/auth/SignupForm';
import { PatientSignupStep2 } from '../components/auth/patient/PatientSignupStep2';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

      // Simple password validation
      if (formData.password.length < 6) {
        toast({
          title: "Password Requirements Not Met",
          description: "Password must be at least 6 characters long.",
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
      console.log("🔄 Starting patient signup process...");
      console.log("Form data:", { email: formData.email, fullName: formData.fullName, language: formData.language });
      
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Validate referral code if provided
      if (formData.referralCode?.trim()) {
        const referralCodeInput = formData.referralCode.trim().toUpperCase();
        console.log("🔍 Validating referral code:", referralCodeInput);

        const { data: clinician, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCodeInput)
          .eq('role', 'clinician')
          .maybeSingle();

        console.log("🔍 Referral code query result:", { clinician, error });

        if (error) {
          console.error("❌ Database error during referral code validation:", error);
          toast({
            title: "Database Error",
            description: "There was an error validating the referral code. Please try again.",
            variant: "destructive"
          });
          return;
        }

        if (!clinician) {
          console.log("❌ No clinician found with referral code:", referralCodeInput);
          toast({
            title: "Invalid Referral Code",
            description: "Please check the referral code with your clinician",
            variant: "destructive"
          });
          return;
        }

        console.log("✅ Referral code validation successful, clinician found:", clinician.id);
      }

      const metadata = {
        first_name: firstName,
        last_name: lastName || '',
        role: 'patient',
        referral_code: formData.referralCode?.trim()?.toUpperCase() || null,
        language: formData.language
      };

      console.log("Attempting patient signup with metadata:", metadata);

      const success = await signUp(formData.email.trim(), formData.password, metadata);
      
      console.log("Signup result:", success);

      if (success) {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account."
        });
        navigate('/login');
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred during signup",
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
