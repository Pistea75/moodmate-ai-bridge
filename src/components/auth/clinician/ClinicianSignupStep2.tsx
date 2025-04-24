
import { Link } from 'react-router-dom';

interface ClinicianSignupStep2Props {
  formData: {
    specialization: string;
    licenseNumber: string;
    acceptTerms: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function ClinicianSignupStep2({ formData, handleChange }: ClinicianSignupStep2Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="specialization" className="block text-sm font-medium mb-1">
          Specialization
        </label>
        <select
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
        >
          <option value="">Select specialization</option>
          <option value="psychiatrist">Psychiatrist</option>
          <option value="psychologist">Psychologist</option>
          <option value="therapist">Therapist</option>
          <option value="counselor">Counselor</option>
          <option value="social-worker">Social Worker</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
          License Number
        </label>
        <input
          type="text"
          id="licenseNumber"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple"
          placeholder="Your professional license number"
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
          Once your account is created, you'll be able to generate custom referral codes for your patients.
        </p>
      </div>
    </div>
  );
}
