
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface Patient {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface PatientSelectorForAIProps {
  selectedPatientId: string | null;
  onPatientSelect: (patientId: string | null) => void;
}

export function PatientSelectorForAI({ selectedPatientId, onPatientSelect }: PatientSelectorForAIProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get patients linked to this clinician
        const { data: links, error: linksError } = await supabase
          .from('patient_clinician_links')
          .select('patient_id')
          .eq('clinician_id', user.id);

        if (linksError) throw linksError;

        if (!links || links.length === 0) {
          setPatients([]);
          return;
        }

        const patientIds = links.map(link => link.patient_id);

        // Get patient profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', patientIds)
          .eq('role', 'patient');

        if (profilesError) throw profilesError;

        setPatients(profiles || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>Select Patient:</span>
      </div>
      <Select 
        value={selectedPatientId || undefined} 
        onValueChange={(value) => onPatientSelect(value === 'none' ? null : value)}
        disabled={loading}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder={loading ? "Loading patients..." : "Choose a patient to personalize AI"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">General AI (No personalization)</SelectItem>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
