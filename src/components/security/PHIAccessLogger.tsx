import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logEnhancedSecurityEvent } from '@/utils/enhancedSecurityUtils';

interface PHIAccessLoggerProps {
  patientId: string;
  accessType: 'view' | 'edit' | 'export' | 'delete';
  dataType: 'profile' | 'mood_entries' | 'chat_logs' | 'sessions' | 'assessments';
  context?: string;
}

/**
 * Component to log PHI (Protected Health Information) access for HIPAA compliance
 * Automatically logs when mounted and tracks access patterns
 */
export function PHIAccessLogger({ 
  patientId, 
  accessType, 
  dataType, 
  context 
}: PHIAccessLoggerProps) {
  useEffect(() => {
    const logPHIAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.warn('PHI access attempted without authentication');
          return;
        }

        // Log the PHI access event
        await logEnhancedSecurityEvent({
          action: 'phi_access',
          resource: `patient_${dataType}`,
          success: true,
          details: {
            patient_id: patientId,
            access_type: accessType,
            data_type: dataType,
            context: context,
            clinician_id: user.id,
            timestamp: new Date().toISOString(),
            ip_address: 'client_side', // Real IP would be logged server-side
            user_agent: navigator.userAgent
          },
          riskScore: 0 // PHI access is normal operation
        });

        // Also log to dedicated PHI access log if needed
        const { error } = await supabase
          .from('enhanced_security_logs')
          .insert({
            user_id: user.id,
            action: 'phi_access',
            resource: `patient_${dataType}`,
            success: true,
            details: {
              patient_id: patientId,
              access_type: accessType,
              data_type: dataType,
              context: context,
              compliance_marker: 'HIPAA_LOG'
            },
            risk_score: 0
          });

        if (error) {
          console.error('Failed to log PHI access:', error);
        }
      } catch (error) {
        console.error('PHI access logging failed:', error);
      }
    };

    logPHIAccess();
  }, [patientId, accessType, dataType, context]);

  // This component doesn't render anything - it's purely for logging
  return null;
}

/**
 * Hook for manual PHI access logging in functional components
 */
export function usePHIAccessLogger() {
  const logPHIAccess = async (
    patientId: string,
    accessType: 'view' | 'edit' | 'export' | 'delete',
    dataType: 'profile' | 'mood_entries' | 'chat_logs' | 'sessions' | 'assessments',
    context?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('PHI access attempted without authentication');
        return false;
      }

      await logEnhancedSecurityEvent({
        action: 'phi_access',
        resource: `patient_${dataType}`,
        success: true,
        details: {
          patient_id: patientId,
          access_type: accessType,
          data_type: dataType,
          context: context,
          clinician_id: user.id,
          timestamp: new Date().toISOString()
        },
        riskScore: 0
      });

      return true;
    } catch (error) {
      console.error('PHI access logging failed:', error);
      return false;
    }
  };

  return { logPHIAccess };
}