
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAiChatReports, AiChatReport } from '@/hooks/useAiChatReports';
import { Eye, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PatientReports() {
  const { reports, loading, error, fetchReports } = useAiChatReports();
  const [selectedReport, setSelectedReport] = useState<AiChatReport | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const handleRefresh = () => {
    fetchReports();
    toast("Refreshing reports...");
  };

  const handleView = (report: AiChatReport) => {
    setSelectedReport(report);
    setViewOpen(true);
  };

  const handleDownload = (report: AiChatReport) => {
    if (!report.content) {
      toast.error("This report has no content to download.");
      return;
    }
    
    try {
      const blob = new Blob([report.content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/\s+/g, '_')}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">AI Chat Reports</CardTitle>
          <CardDescription>
            View and download your conversation reports
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading your reports...</p>
        ) : error ? (
          <div className="p-4 text-sm bg-destructive/10 text-destructive rounded-md">
            <p>Error loading reports: {error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground">You don't have any reports yet. Generate AI summaries from your chat to create reports.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="p-3 border rounded-md flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm">{report.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(report.chat_date).toLocaleDateString()} · {report.report_type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(report)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(report)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedReport?.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/10 text-sm whitespace-pre-wrap">
              {selectedReport?.content || "This report has no content."}
            </ScrollArea>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => selectedReport && handleDownload(selectedReport)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
