
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, TrendingUp, Calendar, Settings, Download } from 'lucide-react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { ReportsFilters } from '@/components/clinician/reports/ReportsFilters';
import { ReportsList } from '@/components/clinician/reports/ReportsList';
import { ReportBuilder } from '@/components/clinician/reports/ReportBuilder';
import { ReportScheduler } from '@/components/clinician/reports/ReportScheduler';
import { useReportsData } from '@/hooks/useReportsData';

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const {
    reports,
    loading,
    error,
    formatReportTitle,
    onViewReport,
    onDeleteReport,
    deletingReportId,
    onRefresh
  } = useReportsData();

  const reportTypes = Array.from(new Set(reports.map(r => r.report_type).filter(Boolean)));

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Generate insights, track progress, and export patient data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Quick Report
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
              <p className="text-xs text-gray-500">Generated reports</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => {
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return new Date(r.created_at || '') > weekAgo;
                }).length}
              </div>
              <p className="text-xs text-gray-500">Recent reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {reports.filter(r => r.status === 'completed').length}
              </div>
              <p className="text-xs text-gray-500">Finished reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {reports.filter(r => r.status === 'processing').length}
              </div>
              <p className="text-xs text-gray-500">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="existing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Existing Reports
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Report Builder
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-6">
            <ReportsFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              reportTypes={reportTypes}
            />
            <ReportsList 
              reports={reports}
              loading={loading}
              error={error}
              searchTerm={searchTerm}
              typeFilter={typeFilter}
              formatReportTitle={formatReportTitle}
              onViewReport={onViewReport}
              onDeleteReport={onDeleteReport}
              deletingReportId={deletingReportId}
              onRefresh={onRefresh}
            />
          </TabsContent>

          <TabsContent value="builder">
            <ReportBuilder />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600">
                    Comprehensive analytics dashboard with patient outcome trends, comparative analysis, and predictive insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <ReportScheduler />
          </TabsContent>
        </Tabs>
      </div>
    </ClinicianLayout>
  );
}
