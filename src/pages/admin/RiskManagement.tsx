
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, TrendingUp, TrendingDown, Users, Activity, 
  Search, RefreshCw, Clock, Shield, ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface RiskAssessment {
  id: string;
  patient_id: string;
  clinician_id: string;
  risk_level: string;
  risk_score: number;
  ai_assessment: string;
  data_points: any;
  assessed_at: string;
  created_at: string;
  patient_name?: string;
  clinician_name?: string;
}

export default function RiskManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchRiskAssessments();
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  useEffect(() => {
    filterAssessments();
  }, [assessments, searchTerm, riskFilter]);

  const fetchRiskAssessments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('patient_risk_assessments')
        .select(`
          *,
          patient:patient_id (first_name, last_name),
          clinician:clinician_id (first_name, last_name)
        `)
        .order('assessed_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(assessment => ({
        ...assessment,
        patient_name: assessment.patient 
          ? `${assessment.patient.first_name} ${assessment.patient.last_name}`
          : 'Unknown Patient',
        clinician_name: assessment.clinician 
          ? `${assessment.clinician.first_name} ${assessment.clinician.last_name}`
          : 'Unknown Clinician'
      }));

      setAssessments(formattedData);
    } catch (error) {
      console.error('Error fetching risk assessments:', error);
      toast.error('Failed to load risk assessments');
    } finally {
      setLoading(false);
    }
  };

  const filterAssessments = () => {
    let filtered = assessments;

    if (searchTerm) {
      filtered = filtered.filter(assessment => 
        assessment.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.clinician_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.ai_assessment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter(assessment => assessment.risk_level === riskFilter);
    }

    setFilteredAssessments(filtered);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return <TrendingDown className="h-4 w-4" />;
      case 'medium': return <Activity className="h-4 w-4" />;
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getDistributionByRisk = () => {
    const distribution = assessments.reduce((acc, assessment) => {
      acc[assessment.risk_level] = (acc[assessment.risk_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      low: distribution.low || 0,
      medium: distribution.medium || 0,
      high: distribution.high || 0,
      critical: distribution.critical || 0
    };
  };

  if (superAdminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  const riskDistribution = getDistributionByRisk();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              Risk Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and assess patient risk levels</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchRiskAssessments} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-800 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Risk Distribution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Low Risk</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{riskDistribution.low}</div>
              <p className="text-xs text-green-600">Patients</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Medium Risk</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{riskDistribution.medium}</div>
              <p className="text-xs text-yellow-600">Patients</p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">High Risk</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{riskDistribution.high}</div>
              <p className="text-xs text-red-600">Patients</p>
            </CardContent>
          </Card>
          
          <Card className="border-red-300 dark:border-red-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Critical Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-800" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{riskDistribution.critical}</div>
              <p className="text-xs text-red-800">Patients</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients or clinicians..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="critical">Critical Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessments Table */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Risk Assessments ({filteredAssessments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Patient</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Risk Level</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Score</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Clinician</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">AI Assessment</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Assessed</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {assessment.patient_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRiskColor(assessment.risk_level)} font-medium`}>
                          <div className="flex items-center gap-1">
                            {getRiskIcon(assessment.risk_level)}
                            {assessment.risk_level.toUpperCase()}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {assessment.risk_score}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {assessment.clinician_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-gray-600 dark:text-gray-400">
                          {assessment.ai_assessment || 'No assessment available'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {new Date(assessment.assessed_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
