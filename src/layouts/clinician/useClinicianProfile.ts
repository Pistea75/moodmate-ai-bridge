
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';

export function useClinicianProfile() {
  const { user } = useAuth();
  const { isSuperAdmin } = useSecureRoleValidation(user);
  const [clinicianFullName, setClinicianFullName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, is_super_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim();
          setClinicianFullName(fullName || 'Admin User');
        }
      } catch (error) {
        console.error('Error fetching clinician profile:', error);
        setClinicianFullName('Admin User');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  return {
    clinicianFullName,
    loading,
    isSuperAdmin
  };
}
