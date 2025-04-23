
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Reports() {
  const reports = [
    {
      id: 1,
      title: "Session Summary - Sarah Johnson",
      date: "2025-04-23",
      type: "Session",
      status: "AI Generated"
    },
    {
      id: 2,
      title: "Weekly Chat Analysis - Michael Chen",
      date: "2025-04-22",
      type: "AI Chat",
      status: "Ready"
    },
    {
      id: 3,
      title: "Treatment Progress Report - Emily Wilson",
      date: "2025-04-21",
      type: "Progress",
      status: "Ready for Review"
    }
  ];

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
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Date: {report.date}</span>
                    <span>•</span>
                    <span>Type: {report.type}</span>
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
          ))}
        </div>
      </div>
    </ClinicianLayout>
  );
}

