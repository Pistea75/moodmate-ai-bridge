
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { 
  validatePasswordStrength, 
  getPasswordStrengthLevel, 
  getPasswordStrengthColor 
} from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showSuggestions?: boolean;
}

export function PasswordStrengthIndicator({ 
  password, 
  showSuggestions = true 
}: PasswordStrengthIndicatorProps) {
  const result = validatePasswordStrength(password);
  const level = getPasswordStrengthLevel(result.score);
  const colorClass = getPasswordStrengthColor(result.score);

  if (!password) {
    return null;
  }

  const getIcon = () => {
    switch (level) {
      case 'weak':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'fair':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'good':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'strong':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {getIcon()}
        <span className={`text-sm font-medium ${colorClass}`}>
          Password strength: {level} ({result.score}%)
        </span>
      </div>
      
      <Progress 
        value={result.score} 
        className="h-2"
        // @ts-ignore - Progress component accepts className
        indicatorClassName={
          level === 'weak' ? 'bg-red-500' :
          level === 'fair' ? 'bg-orange-500' :
          level === 'good' ? 'bg-yellow-500' :
          'bg-green-500'
        }
      />

      {result.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-600">Requirements:</p>
          <ul className="text-sm text-red-600 space-y-1">
            {result.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && result.suggestions.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-600">Suggestions:</p>
          <ul className="text-sm text-blue-600 space-y-1">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
