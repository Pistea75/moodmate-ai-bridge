
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAiChatReports } from '@/hooks/useAiChatReports';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ReportViewerModal } from '@/components/clinician/ReportViewerModal';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

export default function Reports() {
  const { reports, loading, error, fetchReports } = useAiChatReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [patientNames, setPatientNames] = useState<{[key: string]: string}>({});

  // Fetch patient names for display
  useEffect(() => {
    const fetchPatientNames = async () => {
      const patientIds = [...new Set(reports.map(report => report.patient_id))].filter(Boolean);
      
      if (patientIds.length === 0) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', patientIds);

        if (error) {
          console.error('Error fetching patient names:', error);
          return;
        }

        const nameMap: {[key: string]: string} = {};
        data?.forEach(profile => {
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          nameMap[profile.id] = fullName || 'Unknown Patient';
        });
        
        setPatientNames(nameMap);
      } catch (err) {
        console.error('Error fetching patient names:', err);
      }
    };

    fetchPatientNames();
  }, [reports]);

  // Debug logging
  useEffect(() => {
    console.log('Reports page - loading:', loading);
    console.log('Reports page - error:', error);
    console.log('Reports page - reports count:', reports.length);
    console.log('Reports page - reports data:', reports);
  }, [loading, error, reports]);

  // Extract unique report types for the filter dropdown
  const reportTypes = [...new Set(reports.map(report => report.report_type))].filter(Boolean);

  const filteredReports = reports.filter(report => {
    const patientName = patientNames[report.patient_id] || '';
    const reportTitle = formatReportTitle(report);
    const matchesSearch = reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.report_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatReportTitle = (report) => {
    const patientName = patientNames[report.patient_id] || 'Unknown Patient';
    const date = new Date(report.chat_date).toLocaleDateString();
    return `${patientName} - ${date}`;
  };

  const handleDownload = (report) => {
    if (!report.content) {
      toast.error("This report has no content to download.");
      return;
    }
    
    try {
      const blob = new Blob([report.content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = formatReportTitle(report).replace(/\s+/g, '_');
      link.download = `${fileName}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    }
  };

  const handleDelete = async (reportId: string) => {
    try {
      setDeletingReportId(reportId);
      
      const { error } = await supabase
        .from('ai_chat_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      toast.success("Report deleted successfully");
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete report");
    } finally {
      setDeletingReportId(null);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing reports...');
    fetchReports();
    toast.success("Reports refreshed");
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Chat Reports</h1>
            <p className="text-muted-foreground">View and analyze patient chat sessions</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1 flex-1">
            <Label htmlFor="search">Search Reports</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search by patient name, title or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1 w-[180px]">
            <Label htmlFor="type-filter">Report Type</Label>
            <Select 
              value={typeFilter} 
              onValueChange={setTypeFilter}
            >
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {reportTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Debug information in development */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <div className="text-sm space-y-1">
              <p>Loading: {loading ? 'true' : 'false'}</p>
              <p>Error: {error || 'none'}</p>
              <p>Reports found: {reports.length}</p>
              <p>Filtered reports: {filteredReports.length}</p>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {loading ? (
            <p className="text-muted-foreground">Loading reports...</p>
          ) : error ? (
            <Card className="p-4 border-destructive">
              <p className="text-destructive">Error: {error}</p>
              <Button onClick={handleRefresh} variant="outline" className="mt-2">
                Try Again
              </Button>
            </Card>
          ) : filteredReports.length === 0 ? (
            <Card className="p-4">
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== 'all' ? "No matching reports found." : "No reports available."}
              </p>
              {reports.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Reports will appear here after patients generate AI chat summaries.
                </p>
              )}
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{formatReportTitle(report)}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Type: {report.report_type}</span>
                      <span>•</span>
                      <span>Status: {report.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Report</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this report? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(report.id)}
                            disabled={deletingReportId === report.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingReportId === report.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <ReportViewerModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedReport(null);
          }}
          report={selectedReport ? { ...selectedReport, title: formatReportTitle(selectedReport) } : null}
          onDownload={handleDownload}
        />
      </div>
    </ClinicianLayout>
  );
}
