
import { Link } from 'react-router-dom';

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
        <label htmlFor="referralCode" className="block text-sm font-medium mb-1">
          Clinician Referral Code (Optional)
        </label>
        <input
          type="text"
          id="referralCode"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
          placeholder="Enter referral code if you have one"
        />
      </div>
      
      <div className="flex items-start">
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
          <Link to="/terms" className="text-mood-purple hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-mood-purple hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      
      <div className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          You can perform a brief self-assessment after registration to help personalize your experience.
        </p>
      </div>
    </div>
  );
}
