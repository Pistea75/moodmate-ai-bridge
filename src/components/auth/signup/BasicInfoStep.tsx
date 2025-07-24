
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validatePassword } from "@/utils/securityUtils";

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
  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = formData.password && formData.confirmPassword && !passwordsMatch;
  const showPasswordValidation = formData.password.length > 0;

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
          className={`mt-1 ${!passwordValidation.isValid && showPasswordValidation ? 'border-red-500' : ''}`}
          placeholder="Create a secure password"
        />
        
        {showPasswordValidation && (
          <div className="mt-2 space-y-1">
            <div className="text-sm font-medium">Password Requirements:</div>
            {passwordValidation.errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <XCircle className="h-3 w-3 text-red-500" />
                <span className="text-red-600">{error}</span>
              </div>
            ))}
            {passwordValidation.isValid && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-green-600">Password meets all requirements</span>
              </div>
            )}
          </div>
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
        {showPasswordError && (
          <div className="flex items-center gap-2 text-xs mt-1">
            <XCircle className="h-3 w-3 text-red-500" />
            <span className="text-red-600">Passwords do not match</span>
          </div>
        )}
        {formData.password && formData.confirmPassword && passwordsMatch && (
          <div className="flex items-center gap-2 text-xs mt-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-green-600">Passwords match</span>
          </div>
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
