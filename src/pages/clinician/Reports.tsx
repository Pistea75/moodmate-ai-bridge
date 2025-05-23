
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAiChatReports } from '@/hooks/useAiChatReports';
import { useState } from 'react';

export default function Reports() {
  const { reports, loading, error } = useAiChatReports();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report => 
    report.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.report_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Chat Reports</h1>
            <p className="text-muted-foreground">View and analyze patient chat sessions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="w-[250px] pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <p className="text-muted-foreground">Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredReports.length === 0 ? (
            <p className="text-muted-foreground">
              {searchTerm ? "No matching reports found." : "No reports available."}
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
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ClinicianLayout>
  );
}
