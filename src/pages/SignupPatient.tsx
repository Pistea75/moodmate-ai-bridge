
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/auth/AuthFormLayout';
import { StepIndicator } from '../components/auth/StepIndicator';
import { SignupForm } from '../components/auth/SignupForm';
import { PatientSignupStep2 } from '../components/auth/patient/PatientSignupStep2';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validatePasswordStrength } from '@/utils/enhancedSecurityUtils';

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

    try {
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      let referralCodeInput: string | null = null;

      if (formData.referralCode?.trim()) {
        referralCodeInput = formData.referralCode.trim().toUpperCase();

        const { data: clinician, error } = await supabase
          .from('profiles')
          .select('id')
          .ilike('referral_code', referralCodeInput)
          .eq('role', 'clinician')
          .maybeSingle();

        if (error || !clinician) {
          toast({
            title: "Invalid Referral Code",
            description: "Please check the referral code with your clinician",
            variant: "destructive"
          });
          return;
        }
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName || '',
            role: 'patient',
            referral_code: referralCodeInput,
            language: formData.language
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        toast({
          title: "Error",
          description: signUpError.message,
          variant: "destructive"
        });
        return;
      }

      const newUser = data.user;

      if (!newUser) {
        throw new Error('User not returned after signup');
      }

      // Create profile manually
      const { data: patientProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          first_name: firstName,
          last_name: lastName || '',
          role: 'patient',
          referral_code: referralCodeInput,
          language: formData.language,
          email: formData.email
        })
        .select()
        .single();

      if (profileError) {
        console.error('Failed to create patient profile:', profileError);
        toast({
          title: "Error",
          description: "Could not create profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Link patient to clinician if referral code is valid
      if (referralCodeInput) {
        const { data: clinicianProfile, error: clinicianError } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCodeInput)
          .eq('role', 'clinician')
          .single();

        if (clinicianError || !clinicianProfile) {
          console.warn('Clinician not found to link');
        } else {
          const { error: linkError } = await supabase
            .from('patient_clinician_links')
            .insert({
              patient_id: patientProfile.id,
              clinician_id: clinicianProfile.id
            });

          if (linkError) {
            console.error('Error linking patient to clinician:', linkError);
            toast({
              title: "Warning",
              description: "Account created, but failed to link to clinician.",
              variant: "default"
            });
          } else {
            console.log("✅ Patient linked to clinician successfully");
          }
        }
      }

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account."
      });

      navigate('/login');
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
