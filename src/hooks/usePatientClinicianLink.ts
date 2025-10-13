import { useState, useEffect } from 'react';
import { useAssignedClinician } from './useAssignedClinician';

export function usePatientClinicianLink() {
  const { clinician, loading } = useAssignedClinician();
  const [hasExistingClinician, setHasExistingClinician] = useState(false);
  const [clinicianInfo, setClinicianInfo] = useState<{
    id: string;
    first_name: string;
    last_name: string;
  } | null>(null);

  useEffect(() => {
    if (clinician) {
      setHasExistingClinician(true);
      setClinicianInfo({
        id: clinician.id,
        first_name: clinician.first_name,
        last_name: clinician.last_name
      });
    } else {
      setHasExistingClinician(false);
      setClinicianInfo(null);
    }
  }, [clinician]);

  return { hasExistingClinician, clinicianInfo, loading };
}
