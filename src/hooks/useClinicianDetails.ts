
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { resolvePatientSessionDetails } from '@/utils/clinicianPatientUtils';

export function useClinicianDetails() {
  const { user } = useAuth();
  const [clinicianName, setClinicianName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinicianDetails = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Get the clinician ID for the current patient
        const { clinicianId } = await resolvePatientSessionDetails(user.id);
        
        if (clinicianId) {
          // Fetch the clinician's profile information
          const { data: clinician, error: clinicianError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', clinicianId)
            .maybeSingle();
          
          if (clinicianError) {
            throw clinicianError;
          }
          
          if (clinician) {
            // Use last name if available, otherwise use first name
            const displayName = clinician.last_name || clinician.first_name || 'Martinez';
            setClinicianName(displayName);
          }
        }
      } catch (error) {
        console.error("Error fetching clinician details:", error);
        setError("Failed to fetch clinician information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchClinicianDetails();
  }, [user]);

  return { clinicianName, loading, error };
}
