
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Clock, Mail, Calendar } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  enabled: boolean;
  nextRun: Date;
}

export function ReportScheduler() {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Weekly Patient Progress',
      type: 'patient_progress',
      frequency: 'weekly',
      recipients: ['admin@clinic.com'],
      enabled: true,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [newReport, setNewReport] = useState({
    name: '',
    type: '',
    frequency: 'weekly' as const,
    recipients: ''
  });

  const handleAddSchedule = () => {
    if (!newReport.name || !newReport.type) return;

    const schedule: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      type: newReport.type,
      frequency: newReport.frequency,
      recipients: newReport.recipients.split(',').map(email => email.trim()),
      enabled: true,
      nextRun: new Date(Date.now() + (newReport.frequency === 'daily' ? 1 : newReport.frequency === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000)
    };

    setScheduledReports(prev => [...prev, schedule]);
    setNewReport({ name: '', type: '', frequency: 'weekly', recipients: '' });
  };

  const toggleSchedule = (id: string) => {
    setScheduledReports(prev => prev.map(report => 
      report.id === id ? { ...report, enabled: !report.enabled } : report
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Automated Report Scheduling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium">Create New Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Report Name</Label>
              <Input
                value={newReport.name}
                onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Weekly Progress Report"
              />
            </div>
            <div>
              <Label>Report Type</Label>
              <Select value={newReport.type} onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient_progress">Patient Progress</SelectItem>
                  <SelectItem value="mood_summary">Mood Summary</SelectItem>
                  <SelectItem value="session_overview">Session Overview</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Frequency</Label>
              <Select value={newReport.frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setNewReport(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipients (comma-separated emails)</Label>
              <Input
                value={newReport.recipients}
                onChange={(e) => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                placeholder="admin@clinic.com, supervisor@clinic.com"
              />
            </div>
          </div>
          <Button onClick={handleAddSchedule}>Add Schedule</Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Scheduled Reports</h3>
          {scheduledReports.map(report => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">{report.name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {report.frequency}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {report.recipients.length} recipient(s)
                  </span>
                </div>
              </div>
              <Switch
                checked={report.enabled}
                onCheckedChange={() => toggleSchedule(report.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
