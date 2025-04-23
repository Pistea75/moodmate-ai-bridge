
import { Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
    // Add more reports as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
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
  );
}
