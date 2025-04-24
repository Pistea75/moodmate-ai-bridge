
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientSignupStep2Props {
  formData: {
    referralCode: string;
    acceptTerms: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PatientSignupStep2({ formData, handleChange }: PatientSignupStep2Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="referralCode" className="block text-sm font-medium mb-1">
          Clinician Referral Code (Optional)
        </Label>
        <Input
          type="text"
          id="referralCode"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleChange}
          className="w-full uppercase"
          placeholder="Enter referral code if you have one"
          maxLength={6}
        />
        <p className="text-xs text-muted-foreground mt-1">
          If your clinician gave you a referral code, enter it here to connect your account
        </p>
      </div>
      
      <div className="flex items-start mt-4">
        <input
          type="checkbox"
          id="acceptTerms"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
          className="mt-1"
        />
        <label htmlFor="acceptTerms" className="ml-2 text-sm">
          I agree to MoodMate's{' '}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      
      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          You can perform a brief self-assessment after registration to help personalize your experience.
        </p>
      </div>
    </div>
  );
}
