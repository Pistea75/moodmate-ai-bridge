
import { useEffect, useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { resolvePatientSessionDetails } from '@/utils/clinicianPatientUtils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function PatientChat() {
  const { user } = useAuth();
  const [clinicianName, setClinicianName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicianDetails = async () => {
      if (!user) return;
      
      try {
        // Get the clinician ID for the current patient
        const { clinicianId } = await resolvePatientSessionDetails(user.id);
        
        if (clinicianId) {
          // Fetch the clinician's profile information
          const { data: clinician } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', clinicianId)
            .maybeSingle();
          
          if (clinician) {
            // Use last name if available, otherwise use first name
            const displayName = clinician.last_name || clinician.first_name || 'Martinez';
            setClinicianName(displayName);
          }
        }
      } catch (error) {
        console.error("Error fetching clinician details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClinicianDetails();
  }, [user]);

  return (
    <PatientLayout>
      <AudioChatInterface clinicianName={clinicianName || 'Martinez'} />
    </PatientLayout>
  );
}
