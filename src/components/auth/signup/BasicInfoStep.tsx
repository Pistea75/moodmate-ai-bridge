
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BasicInfoStepProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    language: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
}

export function BasicInfoStep({ formData, handleChange, error }: BasicInfoStepProps) {
  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };
  
  const passwordError = validatePassword();
  const showPasswordError = formData.password && formData.confirmPassword && passwordError;

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className={`mt-1 ${showPasswordError ? 'border-red-500' : ''}`}
          placeholder="Create a password"
        />
        {formData.password && formData.password.length < 6 && (
          <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className={`mt-1 ${showPasswordError ? 'border-red-500' : ''}`}
          placeholder="Confirm password"
        />
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="language">Preferred Language</Label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mood-purple mt-1"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
}
