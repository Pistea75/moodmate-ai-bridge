
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Trash2, MessageSquare, Video, Users, Mic } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ReportsListProps {
  reports: any[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  typeFilter: string;
  formatReportTitle: (report: any) => string;
  onViewReport: (report: any) => void;
  onDeleteReport: (reportId: string) => void;
  deletingReportId: string | null;
  onRefresh: () => void;
}

export function ReportsList({
  reports,
  loading,
  error,
  searchTerm,
  typeFilter,
  formatReportTitle,
  onViewReport,
  onDeleteReport,
  deletingReportId,
  onRefresh
}: ReportsListProps) {
  const getReportIcon = (reportType: string) => {
    switch (reportType) {
      case 'session_recording':
        return <Video className="h-4 w-4 text-blue-600" />;
      case 'ai_chat':
      default:
        return <MessageSquare className="h-4 w-4 text-green-600" />;
    }
  };

  const getReportTypeLabel = (reportType: string) => {
    switch (reportType) {
      case 'session_recording':
        return 'Session Report';
      case 'ai_chat':
        return 'Chat Report';
      default:
        return reportType || 'Report';
    }
  };

  const handleDownload = (report: any) => {
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

  if (loading) {
    return <p className="text-muted-foreground">Loading reports...</p>;
  }

  if (error) {
    return (
      <Card className="p-4 border-destructive">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={onRefresh} variant="outline" className="mt-2">
          Try Again
        </Button>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">
          {searchTerm || typeFilter !== 'all' ? "No matching reports found." : "No reports available."}
        </p>
        {reports.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Reports will appear here after patients generate AI chat summaries or after sessions with recording are completed and processed.
          </p>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                {getReportIcon(report.report_type)}
              </div>
              <div>
                <h3 className="font-medium">{formatReportTitle(report)}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getReportTypeLabel(report.report_type)}
                  </Badge>
                  <span>•</span>
                  <span>Status: {report.status}</span>
                  {report.session_type && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {report.session_type === 'online' ? <Video className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        <span className="capitalize">{report.session_type?.replace('_', ' ')}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewReport(report)}
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
                      onClick={() => onDeleteReport(report.id)}
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
      ))}
    </div>
  );
}
