
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoodChart } from '@/components/mood/MoodChart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ClinicianLayout from '../../layouts/ClinicianLayout';

interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  language: string;
}

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        
        if (!patientId) {
          setError('Patient ID is missing');
          setLoading(false);
          return;
        }

        // Fetch patient profile data
        const { data: patientData, error: patientError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', patientId)
          .single();

        if (patientError) {
          console.error('Error fetching patient:', patientError);
          setError(patientError.message);
        } else {
          setPatient(patientData);
        }
        
      } catch (err: any) {
        console.error('Error in fetchPatientDetails:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  const handleGoBack = () => {
    navigate('/clinician/patients');
  };

  if (loading) {
    return (
      <ClinicianLayout>
        <div className="space-y-4">
          <div className="animate-pulse bg-muted h-8 w-1/3 rounded"></div>
          <div className="animate-pulse bg-muted h-64 w-full rounded"></div>
          <div className="animate-pulse bg-muted h-48 w-full rounded"></div>
        </div>
      </ClinicianLayout>
    );
  }

  if (error || !patient) {
    return (
      <ClinicianLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Patient not found'}
          </AlertDescription>
        </Alert>
        <Button onClick={handleGoBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
      </ClinicianLayout>
    );
  }

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {patient.first_name} {patient.last_name}'s Profile
            </h1>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-semibold text-xl">Personal Information</h2>
                <div className="mt-2 space-y-2">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Email:</span> {patient.email}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Language:</span> {patient.language || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 grid-cols-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
              <PatientMoodChart patientId={patientId} />
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
            <PatientTasksList patientId={patientId} />
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}

// Component to display mood chart for a specific patient
const PatientMoodChart = ({ patientId }: { patientId: string }) => {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setMoodData(data || []);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMoodData();
  }, [patientId]);
  
  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading mood data...</div>;
  }
  
  if (moodData.length === 0) {
    return <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
      <p className="text-muted-foreground">No mood data available for this patient.</p>
    </div>;
  }
  
  return <MoodChart patientId={patientId} />;
};

// Component to display tasks for a specific patient
const PatientTasksList = ({ patientId }: { patientId: string }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('patient_id', patientId)
          .order('due_date', { ascending: true });
          
        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [patientId]);
  
  if (loading) {
    return <div className="h-24 flex items-center justify-center">Loading tasks...</div>;
  }
  
  if (tasks.length === 0) {
    return <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
      <p className="text-muted-foreground">No tasks assigned to this patient.</p>
    </div>;
  }
  
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-4">
      {tasks.map((task: any) => (
        <Card key={task.id} className={`p-4 ${task.completed ? 'bg-muted/50' : ''}`}>
          <div className="flex items-start gap-3">
            <div className={`mt-1 size-5 rounded-full border flex-shrink-0 ${
              task.completed 
                ? 'bg-mood-purple border-mood-purple' 
                : 'border-mood-neutral'
            }`}>
              {task.completed && (
                <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                <span className="text-xs text-muted-foreground">{formatDate(task.due_date)}</span>
              </div>
              <p className={`text-sm mt-1 ${task.completed ? 'text-muted-foreground' : ''}`}>
                {task.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
