
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Clock,
  Brain,
  Heart
} from 'lucide-react';

interface RiskAlert {
  id: string;
  patientId: string;
  patientName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  factors: string[];
  recommendations: string[];
  lastUpdated: string;
}

export function RiskManagementDashboard() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setAlerts([
        {
          id: '1',
          patientId: '1',
          patientName: 'John Doe',
          riskLevel: 'high',
          riskScore: 75,
          factors: ['Declining mood scores', 'Missed appointments'],
          recommendations: ['Schedule immediate follow-up', 'Consider medication review'],
          lastUpdated: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Shield className="h-4 w-4 text-green-600" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const riskStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.riskLevel === 'critical').length,
    high: alerts.filter(a => a.riskLevel === 'high').length,
    medium: alerts.filter(a => a.riskLevel === 'medium').length,
    low: alerts.filter(a => a.riskLevel === 'low').length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading risk assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Risk Management Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor patient risk levels and alerts</p>
        </div>
        <Button>
          <Brain className="h-4 w-4 mr-2" />
          Generate Risk Report
        </Button>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{riskStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{riskStats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-orange-600">{riskStats.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
                <p className="text-2xl font-bold text-yellow-600">{riskStats.medium}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Low Risk</p>
                <p className="text-2xl font-bold text-green-600">{riskStats.low}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active risk alerts</p>
              <p className="text-sm">All patients are within normal risk parameters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={getRiskColor(alert.riskLevel)}>
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getRiskIcon(alert.riskLevel)}
                          <span className="font-semibold">{alert.patientName}</span>
                          <Badge className={getRiskColor(alert.riskLevel)}>
                            {alert.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <span className="text-sm">Score: {alert.riskScore}/100</span>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Risk Factors:</p>
                          <ul className="text-sm space-y-1">
                            {alert.factors.map((factor, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Recommendations:</p>
                          <ul className="text-sm space-y-1">
                            {alert.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
