
import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Users, RefreshCw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { useToast } from '@/hooks/use-toast';
import { PatientStatsCards } from '@/components/clinician/PatientStatsCards';
import { PatientCard, PatientCardData } from '@/components/clinician/PatientCard';
import { PatientFilters } from '@/components/clinician/PatientFilters';
import { PatientOnboardingModal } from '@/components/clinician/PatientOnboardingModal';

interface PatientFiltersState {
  search: string;
  status: string;
  riskLevel: string;
  lastActiveFilter: string;
  moodScoreRange: string;
  onboardingStatus: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<PatientCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [bulkAssessing, setBulkAssessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Onboarding modal state
  const [onboardingModal, setOnboardingModal] = useState<{
    open: boolean;
    patientId: string;
    patientName: string;
    currentStep: number;
  }>({
    open: false,
    patientId: '',
    patientName: '',
    currentStep: 0
  });

  // Filters state
  const [filters, setFilters] = useState<PatientFiltersState>({
    search: '',
    status: 'all',
    riskLevel: 'all',
    lastActiveFilter: 'all',
    moodScoreRange: 'all',
    onboardingStatus: 'all'
  });

  // Patient statistics
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeThisWeek: 0,
    atRiskPatients: 0,
    pendingOnboarding: 0,
    avgMoodScore: 0,
    upcomingSessions: 0
  });

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching patients...');
      
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      console.log('Current user:', currentUser.user.id);

      // First, get patient IDs linked to this clinician
      const { data: linkData, error: linkError } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', currentUser.user.id);

      if (linkError) {
        console.error('Error fetching patient links:', linkError);
        throw linkError;
      }

      console.log('Patient links found:', linkData);

      if (!linkData || linkData.length === 0) {
        console.log('No patients linked to this clinician');
        setPatients([]);
        setLoading(false);
        return;
      }

      const patientIds = linkData.map(link => link.patient_id).filter(Boolean);
      console.log('Patient IDs:', patientIds);

      // Get patient profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', patientIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data:', profilesData);

      // Get emails from users table
      const { data: emailsData, error: emailsError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', patientIds);

      if (emailsError) {
        console.error('Error fetching emails:', emailsError);
        // Don't throw here, emails are optional
      }

      console.log('Emails data:', emailsData);

      // Get latest mood scores and risk assessments
      const [moodData, riskData, sessionsData] = await Promise.all([
        // Latest mood entries for each patient
        supabase
          .from('mood_entries')
          .select('patient_id, mood_score, created_at')
          .in('patient_id', patientIds)
          .order('created_at', { ascending: false }),

        // Latest risk assessments
        supabase
          .from('patient_risk_assessments')
          .select('patient_id, risk_level, risk_score, assessed_at')
          .eq('clinician_id', currentUser.user.id)
          .in('patient_id', patientIds)
          .order('assessed_at', { ascending: false }),

        // Upcoming sessions count
        supabase
          .from('sessions')
          .select('patient_id')
          .in('patient_id', patientIds)
          .gte('scheduled_time', new Date().toISOString())
      ]);

      console.log('Mood data:', moodData);
      console.log('Risk data:', riskData);
      console.log('Sessions data:', sessionsData);

      // Create lookup maps
      const emailMap = (emailsData || []).reduce((acc, user) => {
        acc[user.id] = user.email;
        return acc;
      }, {} as Record<string, string>);

      const latestMoodMap = (moodData.data || []).reduce((acc, mood) => {
        if (!acc[mood.patient_id] || mood.created_at > acc[mood.patient_id].created_at) {
          acc[mood.patient_id] = mood;
        }
        return acc;
      }, {} as Record<string, any>);

      const latestRiskMap = (riskData.data || []).reduce((acc, risk) => {
        if (!acc[risk.patient_id] || risk.assessed_at > acc[risk.patient_id].assessed_at) {
          acc[risk.patient_id] = risk;
        }
        return acc;
      }, {} as Record<string, any>);

      const sessionCountMap = (sessionsData.data || []).reduce((acc, session) => {
        acc[session.patient_id] = (acc[session.patient_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Process and combine all data
      const processedPatients: PatientCardData[] = (profilesData || [])
        .map((patient: any) => {
          const latestMood = latestMoodMap[patient.id];
          const latestRisk = latestRiskMap[patient.id];
          
          return {
            ...patient,
            email: emailMap[patient.id] || 'No email',
            lastMoodScore: latestMood?.mood_score,
            lastMoodDate: latestMood?.created_at,
            upcomingSessionsCount: sessionCountMap[patient.id] || 0,
            riskLevel: latestRisk?.risk_level,
            riskScore: latestRisk?.risk_score
          };
        });

      console.log('Processed patients:', processedPatients);
      setPatients(processedPatients);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching patients',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get patient IDs for this clinician
      const { data: patientLinks } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', currentUser.user.id);

      const patientIds = patientLinks?.map(link => link.patient_id) || [];

      if (patientIds.length === 0) {
        setStats({
          totalPatients: 0,
          activeThisWeek: 0,
          atRiskPatients: 0,
          pendingOnboarding: 0,
          avgMoodScore: 0,
          upcomingSessions: 0
        });
        return;
      }

      const [profileStats, moodStats, sessionStats, riskStats] = await Promise.all([
        // Profile statistics
        supabase
          .from('profiles')
          .select('status, last_active_at, onboarding_completed')
          .in('id', patientIds),

        // Mood statistics
        supabase
          .from('mood_entries')
          .select('mood_score')
          .in('patient_id', patientIds)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

        // Session statistics
        supabase
          .from('sessions')
          .select('patient_id')
          .in('patient_id', patientIds)
          .gte('scheduled_time', new Date().toISOString()),

        // Risk statistics
        supabase
          .from('patient_risk_assessments')
          .select('risk_level')
          .eq('clinician_id', currentUser.user.id)
          .in('patient_id', patientIds)
      ]);

      const profiles = profileStats.data || [];
      const totalPatients = profiles.length;
      const activeThisWeek = profiles.filter(p => 
        p.last_active_at && new Date(p.last_active_at) >= new Date(weekAgo)
      ).length;
      const pendingOnboarding = profiles.filter(p => !p.onboarding_completed).length;
      
      const moodEntries = moodStats.data || [];
      const avgMoodScore = moodEntries.length > 0 
        ? moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length 
        : 0;

      const upcomingSessions = (sessionStats.data || []).length;

      const riskAssessments = riskStats.data || [];
      const atRiskPatients = riskAssessments.filter(r => 
        r.risk_level === 'HIGH' || r.risk_level === 'CRITICAL'
      ).length;

      setStats({
        totalPatients,
        activeThisWeek,
        atRiskPatients,
        pendingOnboarding,
        avgMoodScore,
        upcomingSessions
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    fetchStats();
  }, [fetchPatients, fetchStats]);

  const handleViewProfile = (patientId: string) => {
    navigate(`/clinician/patients/${patientId}`);
  };

  const handleAssessRisk = (patientId: string) => {
    // Refresh the patients data to get updated risk assessment
    fetchPatients();
  };

  const handleStartOnboarding = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setOnboardingModal({
        open: true,
        patientId,
        patientName: `${patient.first_name} ${patient.last_name}`,
        currentStep: patient.onboarding_step || 1
      });
    }
  };

  const handleBulkRiskAssessment = async () => {
    try {
      setBulkAssessing(true);
      
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      // Assess risk for all patients without recent assessments
      const assessmentPromises = patients
        .filter(patient => !patient.riskLevel) // Only patients without recent risk assessment
        .slice(0, 5) // Limit to 5 at a time to avoid rate limits
        .map(patient => 
          supabase.functions.invoke('assess-patient-risk', {
            body: {
              patientId: patient.id,
              clinicianId: currentUser.user.id
            }
          })
        );

      await Promise.all(assessmentPromises);

      toast({
        title: 'Bulk Assessment Complete',
        description: `Risk assessment completed for ${assessmentPromises.length} patients`
      });

      fetchPatients(); // Refresh data
    } catch (error: any) {
      console.error('Error in bulk assessment:', error);
      toast({
        title: 'Assessment Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setBulkAssessing(false);
    }
  };

  // Filter patients based on current filters
  const filteredPatients = patients.filter(patient => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
      const email = patient.email.toLowerCase();
      if (!fullName.includes(searchTerm) && !email.includes(searchTerm)) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all' && patient.status !== filters.status) {
      return false;
    }

    // Risk level filter
    if (filters.riskLevel !== 'all' && patient.riskLevel !== filters.riskLevel) {
      return false;
    }

    // Last active filter
    if (filters.lastActiveFilter !== 'all') {
      const lastActive = patient.last_active_at ? new Date(patient.last_active_at) : null;
      const now = new Date();
      
      switch (filters.lastActiveFilter) {
        case 'today':
          if (!lastActive || !isSameDay(lastActive, now)) return false;
          break;
        case 'week':
          if (!lastActive || now.getTime() - lastActive.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case 'month':
          if (!lastActive || now.getTime() - lastActive.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
          break;
        case 'inactive':
          if (!lastActive || now.getTime() - lastActive.getTime() < 30 * 24 * 60 * 60 * 1000) return false;
          break;
      }
    }

    // Mood score filter
    if (filters.moodScoreRange !== 'all') {
      const mood = patient.lastMoodScore;
      switch (filters.moodScoreRange) {
        case 'low':
          if (!mood || mood > 3) return false;
          break;
        case 'moderate':
          if (!mood || mood < 4 || mood > 6) return false;
          break;
        case 'high':
          if (!mood || mood < 7) return false;
          break;
        case 'no_data':
          if (mood) return false;
          break;
      }
    }

    // Onboarding filter
    if (filters.onboardingStatus !== 'all') {
      switch (filters.onboardingStatus) {
        case 'completed':
          if (!patient.onboarding_completed) return false;
          break;
        case 'incomplete':
          if (patient.onboarding_completed || patient.onboarding_step === 0) return false;
          break;
        case 'not_started':
          if (patient.onboarding_step > 0) return false;
          break;
      }
    }

    return true;
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      riskLevel: 'all',
      lastActiveFilter: 'all',
      moodScoreRange: 'all',
      onboardingStatus: 'all'
    });
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              Patients
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your patient roster and monitor their progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchPatients}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkRiskAssessment}
              disabled={bulkAssessing || patients.length === 0}
            >
              <Brain className="h-4 w-4 mr-2" />
              {bulkAssessing ? 'Assessing...' : 'Bulk AI Assessment'}
            </Button>
            <Button className="bg-mood-purple hover:bg-mood-purple/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <PatientStatsCards stats={stats} loading={statsLoading} />

        {/* Filters */}
        <PatientFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          patientCount={patients.length}
          filteredCount={filteredPatients.length}
        />

        {/* Patients Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {patients.length === 0 ? 'No patients found' : 'No patients match your filters'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {patients.length === 0 
                    ? 'Start by adding your first patient to begin managing their care.'
                    : 'Try adjusting your filters or search criteria.'
                  }
                </p>
                {patients.length === 0 ? (
                  <Button className="bg-mood-purple hover:bg-mood-purple/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Patient
                  </Button>
                ) : (
                  <Button variant="outline" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onViewProfile={handleViewProfile}
                  onAssessRisk={handleAssessRisk}
                  onStartOnboarding={handleStartOnboarding}
                />
              ))}
            </div>
          )}
        </div>

        {/* Onboarding Modal */}
        <PatientOnboardingModal
          open={onboardingModal.open}
          onClose={() => setOnboardingModal(prev => ({ ...prev, open: false }))}
          patientId={onboardingModal.patientId}
          patientName={onboardingModal.patientName}
          currentStep={onboardingModal.currentStep}
          onComplete={() => {
            fetchPatients();
            fetchStats();
          }}
        />
      </div>
    </ClinicianLayout>
  );
}
