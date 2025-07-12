
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Mail, Phone, MessageSquare, Brain, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientDetailSkeleton } from '@/components/clinician/PatientDetailSkeleton';
import { PatientDetailError } from '@/components/clinician/PatientDetailError';
import { PatientMoodSection } from '@/components/clinician/PatientMoodSection';
import { PatientTasksSection } from '@/components/clinician/PatientTasksSection';
import { ExerciseLogsSection } from '@/components/clinician/ExerciseLogsSection';
import { PatientAIChatLogs } from '@/components/clinician/PatientAIChatLogs';
import { PatientInfoCard } from '@/components/clinician/PatientInfoCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ClinicianLayout from '@/layouts/ClinicianLayout';

interface PatientProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  language: string | null;
  status: string | null;
  last_active_at: string | null;
  onboarding_completed: boolean | null;
  onboarding_step: number | null;
}

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setError('Patient ID is required');
      setLoading(false);
      return;
    }

    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        setError('Please log in to view patient details');
        return;
      }

      // Verify clinician has access to this patient
      const { data: linkData, error: linkError } = await supabase
        .from('patient_clinician_links')
        .select('id')
        .eq('patient_id', patientId)
        .eq('clinician_id', user.user.id)
        .maybeSingle();

      if (linkError) {
        console.error('Error checking patient access:', linkError);
        setError('Failed to verify patient access');
        return;
      }

      if (!linkData) {
        setError('You do not have access to this patient');
        return;
      }

      // Fetch patient profile
      const { data: patientData, error: patientError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          language,
          status,
          last_active_at,
          onboarding_completed,
          onboarding_step
        `)
        .eq('id', patientId)
        .maybeSingle();

      if (patientError) {
        console.error('Error fetching patient:', patientError);
        setError('Failed to load patient data');
        return;
      }

      if (!patientData) {
        setError('Patient not found');
        return;
      }

      setPatient(patientData);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRiskAssessment = async () => {
    if (!patientId) return;

    try {
      setIsAssessing(true);
      
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('assess-patient-risk', {
        body: {
          patientId: patientId,
          clinicianId: currentUser.user.id
        }
      });

      if (error) throw error;

      toast({
        title: 'Risk Assessment Complete',
        description: `Risk level: ${data?.summary?.riskLevel || 'Assessment completed'}`
      });
    } catch (error: any) {
      console.error('Error assessing risk:', error);
      toast({
        title: 'Assessment Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsAssessing(false);
    }
  };

  const handleEmailContact = () => {
    if (patient?.email) {
      window.location.href = `mailto:${patient.email}`;
    } else {
      toast({
        title: 'No Email Available',
        description: 'This patient does not have an email address on file.',
        variant: 'destructive'
      });
    }
  };

  const handlePhoneContact = () => {
    if (patient?.phone) {
      window.location.href = `tel:${patient.phone}`;
    } else {
      toast({
        title: 'No Phone Number Available',
        description: 'This patient does not have a phone number on file.',
        variant: 'destructive'
      });
    }
  };

  const handleChatPatient = () => {
    navigate('/clinician/communications', { 
      state: { selectedPatientId: patientId } 
    });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'P';
  };

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'at_risk':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatientName = () => {
    if (patient?.first_name && patient?.last_name) {
      return `${patient.first_name} ${patient.last_name}`;
    }
    return 'Unnamed Patient';
  };

  if (loading) {
    return (
      <ClinicianLayout>
        <PatientDetailSkeleton />
      </ClinicianLayout>
    );
  }

  if (error) {
    return (
      <ClinicianLayout>
        <PatientDetailError error={error} onRetry={fetchPatientData} />
      </ClinicianLayout>
    );
  }

  if (!patient) {
    return (
      <ClinicianLayout>
        <PatientDetailError error="Patient not found" onRetry={fetchPatientData} />
      </ClinicianLayout>
    );
  }

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/clinician/patients')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Patients
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                  {getInitials(patient.first_name, patient.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {getPatientName()}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status?.replace('_', ' ') || 'Unknown'}
                  </Badge>
                  {!patient.onboarding_completed && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                      Onboarding Incomplete
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailContact}
              disabled={!patient.email}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePhoneContact}
              disabled={!patient.phone}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleChatPatient}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRiskAssessment}
              disabled={isAssessing}
            >
              <Brain className="h-4 w-4 mr-2" />
              {isAssessing ? 'Assessing...' : 'AI Risk Assessment'}
            </Button>
          </div>
        </div>

        {/* Patient Info Card */}
        <PatientInfoCard 
          email={patient.email || 'Not available'} 
          language={patient.language}
        />

        {/* Content Tabs */}
        <Tabs defaultValue="mood" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Mood
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-4">
            <PatientMoodSection patientId={patientId!} patientName={getPatientName()} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <PatientTasksSection patientId={patientId!} />
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            <ExerciseLogsSection patientId={patientId!} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <PatientAIChatLogs patientId={patientId!} />
          </TabsContent>
        </Tabs>
      </div>
    </ClinicianLayout>
  );
}
