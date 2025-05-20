
import { useEffect, useState } from 'react';
import { Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { useToast } from '@/hooks/use-toast';

interface PatientWithEmail {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  language: string | null;
  [key: string]: any;
}

export default function Patients() {
  const [patients, setPatients] = useState<PatientWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // First get all patient profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'patient');
          
        if (profilesError) {
          throw profilesError;
        }
        
        // Then get emails from users table
        const patientIds = profilesData?.map(patient => patient.id) || [];
        const { data: emailsData, error: emailsError } = await supabase
          .from('users')
          .select('id, email')
          .in('id', patientIds);
          
        if (emailsError) {
          throw emailsError;
        }
        
        // Create a map of user IDs to emails
        const emailMap = (emailsData || []).reduce((acc, user) => {
          acc[user.id] = user.email;
          return acc;
        }, {} as Record<string, string>);
        
        // Combine the data
        const processedPatients = (profilesData || []).map(patient => ({
          ...patient,
          email: emailMap[patient.id] || 'N/A'
        }));

        setPatients(processedPatients);
      } catch (error: any) {
        console.error('Error fetching patients:', error.message);
        toast({
          variant: 'destructive',
          title: 'Error fetching patients',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  const handleViewProfile = (patientId: string) => {
    navigate(`/clinician/patients/${patientId}`);
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
    const email = (patient.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  });

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Patients</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="w-[250px] pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-mood-purple hover:bg-mood-purple/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {loading && <p>Loading patients...</p>}
          {!loading && filteredPatients.length === 0 && searchTerm === '' && <p>No patients found.</p>}
          {!loading && filteredPatients.length === 0 && searchTerm !== '' && <p>No patients matching your search.</p>}
          
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
              
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Email: {patient.email}</span>
                    <span>•</span>
                    <span>Language: {patient.language || 'N/A'}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleViewProfile(patient.id)}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  );
}
