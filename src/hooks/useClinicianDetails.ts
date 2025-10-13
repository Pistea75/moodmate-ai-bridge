
import { useState, useEffect } from 'react';
import { useAssignedClinician } from './useAssignedClinician';
import { getClinicianDisplayName } from '@/utils/supabase/clinician';

export function useClinicianDetails() {
  const { clinician, loading, error } = useAssignedClinician();
  const [clinicianName, setClinicianName] = useState('');

  useEffect(() => {
    if (clinician) {
      const displayName = getClinicianDisplayName(clinician) || 'Martinez';
      setClinicianName(displayName);
    }
  }, [clinician]);

  return { clinicianName, loading, error: error || null };
}
