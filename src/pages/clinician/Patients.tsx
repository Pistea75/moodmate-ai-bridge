
import { useEffect, useState } from 'react';
import { Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ClinicianLayout from '../../layouts/ClinicianLayout';

export default function Patients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient');

      if (!error) {
        setPatients(data || []);
      }

      setLoading(false);
    };

    fetchPatients();
  }, []);

  const handleViewProfile = (patientId: string) => {
    navigate(`/clinician/patients/${patientId}`);
  };

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
          {!loading && patients.length === 0 && <p>No patients found.</p>}
          {patients.map((patient) => (
            <Card key={patient.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </h3>
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
