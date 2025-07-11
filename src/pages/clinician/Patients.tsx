
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PatientCard, PatientCardData } from '@/components/clinician/PatientCard';
import { PatientFilters } from '@/components/clinician/PatientFilters';
import { PatientOnboardingModal } from '@/components/clinician/PatientOnboardingModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ClinicianLayout from '@/layouts/ClinicianLayout';

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Updated filters to match PatientFilters interface
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    riskLevel: 'all',
    lastActiveFilter: 'all',
    moodScoreRange: 'all',
    onboardingStatus: 'all'
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        toast.error('Please log in to view patients');
        return;
      }

      // Get patients linked to this clinician
      const { data: patientLinks, error: linksError } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', user.user.id);

      if (linksError) {
        console.error('Error fetching patient links:', linksError);
        toast.error('Failed to load patient links');
        return;
      }

      if (!patientLinks || patientLinks.length === 0) {
        setPatients([]);
        return;
      }

      const patientIds = patientLinks.map(link => link.patient_id);

      // Fetch patient profiles with email and phone
      const { data: patientProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          status,
          last_active_at,
          onboarding_completed,
          onboarding_step
        `)
        .in('id', patientIds);

      if (profilesError) {
        console.error('Error fetching patient profiles:', profilesError);
        toast.error('Failed to load patient profiles');
        return;
      }

      // Get mood data for patients
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('patient_id, mood_score, created_at')
        .in('patient_id', patientIds)
        .order('created_at', { ascending: false });

      // Get risk assessments
      const { data: riskData } = await supabase
        .from('patient_risk_assessments')
        .select('patient_id, risk_level, risk_score')
        .in('patient_id', patientIds)
        .order('assessed_at', { ascending: false });

      // Process and combine data
      const processedPatients: PatientCardData[] = patientProfiles?.map(profile => {
        // Get latest mood entry for this patient
        const latestMood = moodData?.find(mood => mood.patient_id === profile.id);
        
        // Get latest risk assessment for this patient
        const latestRisk = riskData?.find(risk => risk.patient_id === profile.id);

        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email || 'No email',
          phone: profile.phone,
          status: profile.status as 'active' | 'inactive' | 'at_risk' | 'pending',
          last_active_at: profile.last_active_at,
          onboarding_completed: profile.onboarding_completed || false,
          onboarding_step: profile.onboarding_step || 0,
          lastMoodScore: latestMood?.mood_score,
          lastMoodDate: latestMood?.created_at,
          riskLevel: latestRisk?.risk_level as 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL',
          riskScore: latestRisk?.risk_score,
          upcomingSessionsCount: 0 // TODO: Add sessions count
        };
      }) || [];

      setPatients(processedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (patientId: string) => {
    navigate(`/clinician/patients/${patientId}`);
  };

  const handleAssessRisk = (patientId: string) => {
    // Refresh the patient data after risk assessment
    fetchPatients();
  };

  const handleStartOnboarding = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowOnboardingModal(true);
  };

  const handleMessagePatient = (patientId: string) => {
    // Navigate to communications page with patient pre-selected
    navigate('/clinician/communications', { 
      state: { selectedPatientId: patientId } 
    });
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      riskLevel: 'all',
      lastActiveFilter: 'all',
      moodScoreRange: 'all',
      onboardingStatus: 'all'
    });
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = filters.search === '' || 
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || patient.status === filters.status;
    const matchesRisk = filters.riskLevel === 'all' || patient.riskLevel === filters.riskLevel;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    atRisk: patients.filter(p => p.status === 'at_risk' || p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL').length,
    pendingOnboarding: patients.filter(p => !p.onboarding_completed).length
  };

  if (loading) {
    return (
      <ClinicianLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ClinicianLayout>
    );
  }

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-7 w-7 text-blue-600" />
              Patients
            </h1>
            <p className="text-muted-foreground">Manage and monitor your patients</p>
          </div>
          <Button onClick={() => navigate('/clinician/patients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.atRisk}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOnboarding}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <PatientFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          patientCount={patients.length}
          filteredCount={filteredPatients.length}
        />

        {/* Patient Cards Grid */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No patients found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {filters.search || filters.status !== 'all' || filters.riskLevel !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Start by adding your first patient to begin monitoring their progress.'}
              </p>
              <Button onClick={() => navigate('/clinician/patients/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Patient
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onViewProfile={handleViewProfile}
                onAssessRisk={handleAssessRisk}
                onStartOnboarding={handleStartOnboarding}
                onMessagePatient={handleMessagePatient}
              />
            ))}
          </div>
        )}

        {/* Onboarding Modal */}
        <PatientOnboardingModal
          open={showOnboardingModal}
          onClose={() => {
            setShowOnboardingModal(false);
            setSelectedPatientId(null);
          }}
          patientId={selectedPatientId || ''}
          patientName={selectedPatientId ? patients.find(p => p.id === selectedPatientId)?.first_name + ' ' + patients.find(p => p.id === selectedPatientId)?.last_name || '' : ''}
          currentStep={selectedPatientId ? patients.find(p => p.id === selectedPatientId)?.onboarding_step || 1 : 1}
          onComplete={() => {
            setShowOnboardingModal(false);
            setSelectedPatientId(null);
            fetchPatients(); // Refresh data
          }}
        />
      </div>
    </ClinicianLayout>
  );
}
