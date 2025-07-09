
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatientRiskCard } from './PatientRiskCard';
import { calculateRiskScore, RiskAssessment } from '@/lib/utils/riskScoring';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, AlertTriangle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientRiskData {
  id: string;
  name: string;
  riskAssessment: RiskAssessment;
}

export function RiskManagementDashboard() {
  const [patients, setPatients] = useState<PatientRiskData[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientRiskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPatientsRiskData();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, riskFilter]);

  const fetchPatientsRiskData = async () => {
    try {
      setLoading(true);
      
      // Get current user's patients
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: patientLinks } = await supabase
        .from('patient_clinician_links')
        .select(`
          patient_id,
          profiles!patient_clinician_links_patient_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('clinician_id', user.id);

      if (!patientLinks) return;

      const patientsRiskData: PatientRiskData[] = [];

      for (const link of patientLinks) {
        const patientId = link.patient_id;
        const profile = link.profiles as any;
        
        if (!profile) continue;

        // Fetch patient data for risk calculation
        const [moodData, sessionData, taskData, chatData] = await Promise.all([
          supabase
            .from('mood_entries')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false })
            .limit(50),
          supabase
            .from('sessions')
            .select('*')
            .eq('patient_id', patientId)
            .order('scheduled_time', { ascending: false })
            .limit(20),
          supabase
            .from('tasks')
            .select('*')
            .eq('patient_id', patientId)
            .order('inserted_at', { ascending: false })
            .limit(30),
          supabase
            .from('ai_chat_logs')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false })
            .limit(100)
        ]);

        const riskAssessment = calculateRiskScore(
          moodData.data || [],
          sessionData.data || [],
          taskData.data || [],
          chatData.data || []
        );

        patientsRiskData.push({
          id: patientId,
          name: `${profile.first_name} ${profile.last_name}`,
          riskAssessment
        });
      }

      // Sort by risk score (highest risk first)
      patientsRiskData.sort((a, b) => a.riskAssessment.score - b.riskAssessment.score);
      
      setPatients(patientsRiskData);
    } catch (error) {
      console.error('Error fetching patient risk data:', error);
      toast({
        title: "Error",
        description: "Failed to load patient risk data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter(patient =>
        patient.riskAssessment.level === riskFilter
      );
    }

    setFilteredPatients(filtered);
  };

  const getRiskStats = () => {
    const stats = {
      total: patients.length,
      critical: patients.filter(p => p.riskAssessment.level === 'critical').length,
      high: patients.filter(p => p.riskAssessment.level === 'high').length,
      medium: patients.filter(p => p.riskAssessment.level === 'medium').length,
      low: patients.filter(p => p.riskAssessment.level === 'low').length,
    };
    return stats;
  };

  const stats = getRiskStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Risk</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Low Risk</p>
              <p className="text-2xl font-bold text-green-600">{stats.low}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchPatientsRiskData}>
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <PatientRiskCard
            key={patient.id}
            patientId={patient.id}
            patientName={patient.name}
            riskAssessment={patient.riskAssessment}
            onViewDetails={() => window.location.href = `/clinician/patients/${patient.id}`}
          />
        ))}
      </div>

      {filteredPatients.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No patients found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
