
import { AudioChatInterface } from '@/components/AudioChatInterface';
import PatientLayout from '../../layouts/PatientLayout';
import { useClinicianDetails } from '@/hooks/useClinicianDetails';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidAIPreferences } from '@/types/aiPersonalization';

export default function PatientChat() {
  const { clinicianName, loading } = useClinicianDetails();
  const { user } = useAuth();
  const [hasPersonalization, setHasPersonalization] = useState(false);

  // Custom system prompt for CBT-focused assistance
  const systemPrompt = "You are a supportive mental health assistant trained in CBT. Your goal is to help users process difficult thoughts, challenge cognitive distortions, and identify positive coping strategies. Always be empathetic, evidence-based, and non-judgmental. Address the user as a caring professional would, but do not diagnose or provide medical advice.";

  useEffect(() => {
    const checkPersonalization = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('ai_patient_profiles')
          .select('preferences')
          .eq('patient_id', user.id)
          .maybeSingle();

        if (profile?.preferences && isValidAIPreferences(profile.preferences)) {
          setHasPersonalization(true);
        }
      } catch (error) {
        console.error('Error checking personalization:', error);
      }
    };

    checkPersonalization();
  }, [user]);

  return (
    <PatientLayout>
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {hasPersonalization && (
              <div className="text-xs text-muted-foreground mb-2 italic bg-purple-50 p-2 rounded-md border border-purple-200">
                🧠 AI behavior personalized by your clinician
              </div>
            )}
            <AudioChatInterface 
              clinicianName={clinicianName || 'Martinez'} 
              systemPrompt={systemPrompt}
              patientId={user?.id}
            />
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
