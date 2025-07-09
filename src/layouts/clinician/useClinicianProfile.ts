
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useClinicianProfile() {
  const { user } = useAuth();
  const [clinicianName, setClinicianName] = useState('Doctor');
  const [clinicianFullName, setClinicianFullName] = useState('Doctor Name');
  
  useEffect(() => {
    const fetchClinicianProfile = async () => {
      if (user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching clinician profile:', error);
            return;
          }
          
          if (profileData) {
            const firstName = profileData.first_name || '';
            const lastName = profileData.last_name || '';
            
            if (firstName) {
              setClinicianName(firstName);
            }
            
            const fullName = [firstName, lastName].filter(Boolean).join(' ');
            if (fullName) {
              setClinicianFullName(fullName);
            }
          }
        } catch (error) {
          console.error('Error in fetchClinicianProfile:', error);
        }
      }
    };
    
    fetchClinicianProfile();
  }, [user]);

  return { clinicianName, clinicianFullName };
}
