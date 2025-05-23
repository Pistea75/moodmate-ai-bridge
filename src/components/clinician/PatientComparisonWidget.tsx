
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface PatientSummary {
  patient_id: string;
  first_name: string | null;
  last_name: string | null;
  avg_mood: number;
  last_entry: string;
}

export function PatientComparisonWidget() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientSummaries = async () => {
      setLoading(true);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error("No authenticated user found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('get_patient_mood_summaries', {
        clinician_uuid: user.user.id
      });

      if (error) {
        console.error('Error fetching patient summaries:', error);
        setLoading(false);
        return;
      }

      setPatients(data || []);
      setLoading(false);
    };

    fetchPatientSummaries();
  }, []);

  const handleViewPatient = (patientId: string) => {
    navigate(`/clinician/patients/${patientId}`);
  };

  // Function to determine mood status color
  const getMoodColor = (avgMood: number) => {
    if (avgMood <= 3) return "text-red-600";
    if (avgMood <= 5) return "text-amber-600";
    return "text-green-600";
  };

  // Function to determine how recent the last entry was
  const getActivityStatus = (lastEntry: string) => {
    const lastEntryDate = new Date(lastEntry);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) return "text-red-600";
    if (diffDays > 3) return "text-amber-600";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Patient Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p>No patient data available</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/clinician/patients')}
            >
              View All Patients
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.slice(0, 5).map((p) => (
              <div 
                key={p.patient_id} 
                className="flex justify-between items-center hover:bg-muted p-2 rounded-md cursor-pointer"
                onClick={() => handleViewPatient(p.patient_id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {p.first_name} {p.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={getMoodColor(p.avg_mood)}>
                    Avg: {Number(p.avg_mood).toFixed(1)}
                  </span>
                  <span className={getActivityStatus(p.last_entry)}>
                    Last: {format(new Date(p.last_entry), 'MMM d')}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            
            {patients.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/clinician/patients')}
              >
                View all {patients.length} patients
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
