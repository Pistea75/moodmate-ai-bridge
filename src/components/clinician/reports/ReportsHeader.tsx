
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ReportsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function ReportsHeader({ loading, onRefresh }: ReportsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">AI Chat Reports</h1>
        <p className="text-muted-foreground">View and analyze patient chat sessions</p>
      </div>
      <Button 
        onClick={onRefresh} 
        variant="outline"
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
