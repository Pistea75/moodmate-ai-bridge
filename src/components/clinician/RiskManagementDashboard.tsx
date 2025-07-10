import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  Clock,
  Brain,
  Heart,
  Shield,
  Bell,
  Eye,
  CheckCircle
} from 'lucide-react';
import { PatientRiskCard } from './PatientRiskCard';
import { RiskAssessment } from '@/lib/utils/riskScoring';

interface RiskAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'mood_decline' | 'missed_sessions' | 'low_engagement' | 'crisis_indicators';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

const mockRiskAssessments: (RiskAssessment & { patientId: string; patientName: string })[] = [
  {
    patientId: '1',
    patientName: 'Sarah Johnson',
    score: 25,
    level: 'critical',
    factors: {
      moodTrend: -25,
      sessionAttendance: 40,
      taskCompletion: 30,
      communicationFrequency: 20,
      lastMoodScore: 20,
      triggerFrequency: 35
    },
    recommendations: [
      'Immediate safety assessment required',
      'Consider increasing session frequency',
      'Coordinate with crisis intervention team'
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    patientId: '2',
    patientName: 'Mike Chen',
    score: 65,
    level: 'high',
    factors: {
      moodTrend: -15,
      sessionAttendance: 70,
      taskCompletion: 60,
      communicationFrequency: 45,
      lastMoodScore: 50,
      triggerFrequency: 50
    },
    recommendations: [
      'Review current treatment plan',
      'Increase check-in frequency',
      'Consider additional support resources'
    ],
    lastUpdated: new Date().toISOString()
  }
];

const mockAlerts: RiskAlert[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    type: 'mood_decline',
    severity: 'critical',
    message: 'Mood scores have declined significantly over the past week',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    acknowledged: false
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Mike Chen',
    type: 'missed_sessions',
    severity: 'high',
    message: 'Missed 2 consecutive sessions without notice',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    acknowledged: false
  }
];

export function RiskManagementDashboard() {
  const [riskAssessments, setRiskAssessments] = useState(mockRiskAssessments);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [loading, setLoading] = useState(false);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'mood_decline': return <TrendingDown className="h-4 w-4" />;
      case 'missed_sessions': return <Clock className="h-4 w-4" />;
      case 'low_engagement': return <Users className="h-4 w-4" />;
      case 'crisis_indicators': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const criticalPatients = riskAssessments.filter(p => p.level === 'critical');
  const highRiskPatients = riskAssessments.filter(p => p.level === 'high');
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-red-600" />
            Risk Management Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor and manage patient risk factors</p>
        </div>
        <Button variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Run Risk Assessment
        </Button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-700">Critical Risk</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">{criticalPatients.length}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-700">High Risk</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-2">{highRiskPatients.length}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-700">Active Alerts</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-2">{unacknowledgedAlerts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">Total Monitored</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{riskAssessments.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Active Alerts
            {unacknowledgedAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unacknowledgedAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="patients">High-Risk Patients</TabsTrigger>
          <TabsTrigger value="trends">Risk Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Active Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts</p>
                  <p className="text-sm">All patients are within normal risk parameters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                        alert.acknowledged ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <h4 className="font-medium">{alert.patientName}</h4>
                            <p className="text-sm mt-1">{alert.message}</p>
                            <p className="text-xs mt-2 opacity-70">
                              {alert.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Patient
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riskAssessments
              .filter(assessment => assessment.level === 'critical' || assessment.level === 'high')
              .map((assessment) => (
                <PatientRiskCard
                  key={assessment.patientId}
                  patientId={assessment.patientId}
                  patientName={assessment.patientName}
                  riskAssessment={assessment}
                  onViewDetails={() => console.log('View details for', assessment.patientName)}
                />
              ))}
          </div>
          {riskAssessments.filter(a => a.level === 'critical' || a.level === 'high').length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No high-risk patients identified</p>
                <p className="text-sm">All patients are within acceptable risk parameters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Risk Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Risk trends analysis coming soon</p>
                <p className="text-sm">Historical risk data and predictive analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
