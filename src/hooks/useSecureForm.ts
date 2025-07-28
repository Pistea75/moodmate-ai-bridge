
import { useState, useCallback } from 'react';
import { validateAndSanitizeForm, ValidationRule } from '@/utils/secureInputValidation';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';

interface UseSecureFormProps {
  validationRules: Record<string, ValidationRule>;
  onSubmit: (data: Record<string, any>) => Promise<boolean>;
  rateLimitAction?: string;
}

export function useSecureForm({ validationRules, onSubmit, rateLimitAction }: UseSecureFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkRateLimit, trackSecurityEvent } = useEnhancedSecurity();

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: []
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const result = validateAndSanitizeForm(formData, validationRules);
    setErrors(result.errors);
    return result;
  }, [formData, validationRules]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Check rate limiting if action is specified
    if (rateLimitAction) {
      const isAllowed = await checkRateLimit(rateLimitAction);
      if (!isAllowed) {
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const validation = validateForm();
      
      if (!validation.isValid) {
        await trackSecurityEvent('form_validation_failed', rateLimitAction || 'form_submit', {
          errors: validation.errors,
          fields: Object.keys(validation.errors)
        });
        return;
      }

      await trackSecurityEvent('form_validation_success', rateLimitAction || 'form_submit', {
        fields: Object.keys(validation.sanitizedData)
      });

      const success = await onSubmit(validation.sanitizedData);
      
      if (success) {
        await trackSecurityEvent('form_submit_success', rateLimitAction || 'form_submit');
        setFormData({});
        setErrors({});
      } else {
        await trackSecurityEvent('form_submit_failed', rateLimitAction || 'form_submit');
      }
    } catch (error) {
      await trackSecurityEvent('form_submit_error', rateLimitAction || 'form_submit', {
        error: String(error)
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validationRules, onSubmit, isSubmitting, rateLimitAction, checkRateLimit, trackSecurityEvent, validateForm]);

  const clearForm = useCallback(() => {
    setFormData({});
    setErrors({});
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors[field]?.[0] || '';
  }, [errors]);

  const hasFieldError = useCallback((field: string) => {
    return !!(errors[field] && errors[field].length > 0);
  }, [errors]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    clearForm,
    getFieldError,
    hasFieldError,
    validateForm
  };
}
