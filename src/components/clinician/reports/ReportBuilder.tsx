
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Download, Settings } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface ReportConfig {
  type: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  patients: string[];
  metrics: string[];
  format: 'pdf' | 'csv' | 'excel';
}

const reportTypes = [
  { value: 'mood_summary', label: 'Mood Summary Report' },
  { value: 'session_overview', label: 'Session Overview Report' },
  { value: 'task_completion', label: 'Task Completion Report' },
  { value: 'patient_progress', label: 'Patient Progress Report' },
  { value: 'risk_assessment', label: 'Risk Assessment Report' }
];

const availableMetrics = [
  { id: 'mood_trends', label: 'Mood Trends' },
  { id: 'session_attendance', label: 'Session Attendance' },
  { id: 'task_completion_rate', label: 'Task Completion Rate' },
  { id: 'treatment_goals', label: 'Treatment Goals Progress' },
  { id: 'risk_indicators', label: 'Risk Indicators' }
];

export function ReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    type: '',
    dateRange: { from: undefined, to: undefined },
    patients: [],
    metrics: [],
    format: 'pdf'
  });

  const handleGenerateReport = async () => {
    console.log('Generating report with config:', config);
    // TODO: Implement report generation logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Custom Report Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Report Type</Label>
            <Select value={config.type} onValueChange={(value) => setConfig(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Export Format</Label>
            <Select value={config.format} onValueChange={(value: 'pdf' | 'csv' | 'excel') => setConfig(prev => ({ ...prev, format: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.dateRange.from ? format(config.dateRange.from, 'PPP') : 'Select start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={config.dateRange.from}
                  onSelect={(date) => setConfig(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, from: date } 
                  }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.dateRange.to ? format(config.dateRange.to, 'PPP') : 'Select end date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={config.dateRange.to}
                  onSelect={(date) => setConfig(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, to: date } 
                  }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label>Metrics to Include</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {availableMetrics.map(metric => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={config.metrics.includes(metric.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setConfig(prev => ({ ...prev, metrics: [...prev.metrics, metric.id] }));
                    } else {
                      setConfig(prev => ({ ...prev, metrics: prev.metrics.filter(m => m !== metric.id) }));
                    }
                  }}
                />
                <Label htmlFor={metric.id} className="text-sm">
                  {metric.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleGenerateReport} disabled={!config.type}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
