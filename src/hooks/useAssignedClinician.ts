import { useState, useEffect } from 'react';
import { fetchAssignedClinician, ClinicianInfo } from '@/utils/supabase/clinician';

/**
 * Hook to fetch and manage the assigned clinician for the current patient.
 * This hook provides a centralized way to get clinician information across the app.
 */
export function useAssignedClinician() {
  const [clinician, setClinician] = useState<ClinicianInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadClinician = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAssignedClinician();
        
        if (mounted) {
          setClinician(data);
        }
      } catch (err) {
        console.error('Error in useAssignedClinician:', err);
        if (mounted) {
          setError('Failed to load clinician information');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadClinician();

    return () => {
      mounted = false;
    };
  }, []);

  return { clinician, loading, error };
}
