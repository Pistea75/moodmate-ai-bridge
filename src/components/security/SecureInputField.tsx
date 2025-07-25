
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { sanitizeInput, validatePassword, getPasswordStrength } from '@/utils/securityUtils';

interface SecureInputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  showPasswordStrength?: boolean;
  className?: string;
}

export function SecureInputField({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  maxLength = 255,
  placeholder,
  showPasswordStrength = false,
  className = ''
}: SecureInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Apply length limit
    if (inputValue.length > maxLength) {
      return;
    }
    
    // Sanitize input for XSS protection
    const sanitizedValue = type === 'password' ? inputValue : sanitizeInput(inputValue);
    onChange(sanitizedValue);
  };

  const getPasswordStrengthColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPasswordStrengthWidth = (score: number): string => {
    return `${score}%`;
  };

  const passwordStrength = type === 'password' && showPasswordStrength && value 
    ? getPasswordStrength(value) 
    : null;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={label}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={`${type === 'password' ? 'pr-10' : ''} transition-all duration-200 ${
            isFocused ? 'ring-2 ring-blue-500' : ''
          }`}
          autoComplete={type === 'password' ? 'current-password' : 'off'}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Password strength indicator */}
      {passwordStrength && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Password strength:</span>
            <span className={`font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}>
              {passwordStrength.score >= 80 ? 'Strong' : 
               passwordStrength.score >= 60 ? 'Good' : 
               passwordStrength.score >= 40 ? 'Fair' : 'Weak'}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                passwordStrength.score >= 80 ? 'bg-green-500' :
                passwordStrength.score >= 60 ? 'bg-yellow-500' :
                passwordStrength.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: getPasswordStrengthWidth(passwordStrength.score) }}
            />
          </div>
          
          {passwordStrength.feedback.length > 0 && (
            <div className="space-y-1">
              {passwordStrength.feedback.map((feedback, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <AlertTriangle size={12} className="text-yellow-500" />
                  {feedback}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Character count */}
      {maxLength < 1000 && (
        <div className="text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}
