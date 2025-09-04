
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle } from 'lucide-react';
import { getPatientNavItems, getClinicianNavItems } from '../navigation/NavigationItems';
import { useTranslation } from 'react-i18next';

interface TestResult {
  path: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  error?: string;
}

export function NavigationTest() {
  const { t } = useTranslation();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  
  const clinicianNavItems = getClinicianNavItems(t);

  const runNavigationTest = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test all clinician navigation items
    for (const item of clinicianNavItems) {
      try {
        // Simulate navigation test
        const testResult: TestResult = {
          path: item.path,
          name: item.name,
          status: 'pass'
        };

        // Check if route exists in our routing configuration
        const knownRoutes = [
          '/clinician/dashboard',
          '/clinician/patients',
          '/clinician/sessions', 
          '/clinician/tasks',
          '/clinician/reports',
          '/clinician/train-ai',
          '/clinician/settings',
          '/clinician/analytics',
          '/clinician/communications',
          '/clinician/reminders',
          '/clinician/resource-library',
          '/clinician/risk-management'
        ];

        if (!knownRoutes.includes(item.path)) {
          testResult.status = 'warning';
          testResult.error = 'Route may not be implemented';
        }

        results.push(testResult);
        
        // Small delay to simulate testing
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          path: item.path,
          name: item.name,
          status: 'fail',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testSpecificRoute = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <X className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: 'pass' | 'fail' | 'warning') => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Navigation & Route Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runNavigationTest}
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run Navigation Test'}
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <div className="grid gap-2">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <span className="font-medium">{result.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {result.path}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testSpecificRoute(result.path)}
                    >
                      Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {clinicianNavItems.map((item) => (
              <Button
                key={item.path}
                variant="outline"
                size="sm"
                onClick={() => testSpecificRoute(item.path)}
                className="justify-start"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
