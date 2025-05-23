
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAiChatReports } from '@/hooks/useAiChatReports';
import { useState } from 'react';
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

export default function Reports() {
  const { reports, loading, error } = useAiChatReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Extract unique report types for the filter dropdown
  const reportTypes = [...new Set(reports.map(report => report.report_type))].filter(Boolean);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.report_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    return matchesSearch && matchesType;
  });

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
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Chat Reports</h1>
            <p className="text-muted-foreground">View and analyze patient chat sessions</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1 flex-1">
            <Label htmlFor="search">Search Reports</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by title or type..."
                className="pl-9"
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

        <div className="grid gap-4">
          {loading ? (
            <p className="text-muted-foreground">Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredReports.length === 0 ? (
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' ? "No matching reports found." : "No reports available."}
            </p>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Date: {new Date(report.chat_date).toLocaleDateString()}</span>
                      <span>•</span>
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
          report={selectedReport}
          onDownload={handleDownload}
        />
      </div>
    </ClinicianLayout>
  );
}
