import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function usePatientClinicianLink() {
  const { user } = useAuth();
  const [hasExistingClinician, setHasExistingClinician] = useState(false);
  const [clinicianInfo, setClinicianInfo] = useState<{
    id: string;
    first_name: string;
    last_name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkClinicianLink = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: link, error } = await supabase
          .from('patient_clinician_links')
          .select(`
            clinician_id,
            profiles:clinician_id (
              id,
              first_name,
              last_name
            )
          `)
          .eq('patient_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (link && link.profiles) {
          setHasExistingClinician(true);
          setClinicianInfo(link.profiles as any);
        } else {
          setHasExistingClinician(false);
          setClinicianInfo(null);
        }
      } catch (error) {
        console.error('Error checking clinician link:', error);
      } finally {
        setLoading(false);
      }
    };

    checkClinicianLink();
  }, [user]);

  return { hasExistingClinician, clinicianInfo, loading };
}