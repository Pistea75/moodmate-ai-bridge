
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { sanitizeInput, validateFormData } from '@/utils/securityUtils';
import { cn } from '@/lib/utils';

interface SecureInputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  className?: string;
  showPasswordToggle?: boolean;
  autoComplete?: string;
}

export function SecureInputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  minLength,
  pattern,
  patternMessage,
  className,
  showPasswordToggle = false,
  autoComplete,
}: SecureInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const validateInput = useCallback((inputValue: string) => {
    const rules: any = {
      [id]: {
        required,
        maxLength,
        minLength,
        pattern,
        message: patternMessage
      }
    };

    const { isValid, errors } = validateFormData({ [id]: inputValue }, rules);
    setError(errors[id] || '');
    return isValid;
  }, [id, required, maxLength, minLength, pattern, patternMessage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Sanitize input for XSS prevention (except for passwords)
    const sanitizedValue = type === 'password' ? rawValue : sanitizeInput(rawValue);
    
    // Validate input
    validateInput(sanitizedValue);
    
    onChange(sanitizedValue);
  }, [type, onChange, validateInput]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    validateInput(value);
  }, [value, validateInput]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setError('');
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;

  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={id} 
        className={cn(
          'text-sm font-medium',
          hasError && 'text-destructive',
          required && "after:content-['*'] after:text-destructive after:ml-1"
        )}
      >
        {label}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={cn(
            'pr-10',
            hasError && 'border-destructive focus:border-destructive',
            isFocused && !hasError && 'border-primary'
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
        
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
        
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>
      
      {hasError && (
        <p id={`${id}-error`} className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
