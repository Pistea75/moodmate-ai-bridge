
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function usePatientProfile() {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState('Patient');
  const [patientFullName, setPatientFullName] = useState('Patient Name');
  
  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching patient profile:', error);
            return;
          }
          
          if (profileData) {
            const firstName = profileData.first_name || '';
            const lastName = profileData.last_name || '';
            
            if (firstName) {
              setPatientName(firstName);
            }
            
            const fullName = [firstName, lastName].filter(Boolean).join(' ');
            if (fullName) {
              setPatientFullName(fullName);
            }
          }
        } catch (error) {
          console.error('Error in fetchPatientProfile:', error);
        }
      }
    };
    
    fetchPatientProfile();
  }, [user]);

  return { patientName, patientFullName };
}
