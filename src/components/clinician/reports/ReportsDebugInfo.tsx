
import { Card } from "@/components/ui/card";

interface ReportsDebugInfoProps {
  loading: boolean;
  error: string | null;
  reportsCount: number;
  filteredCount: number;
}

export function ReportsDebugInfo({ loading, error, reportsCount, filteredCount }: ReportsDebugInfoProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="p-4 bg-muted/50">
      <h3 className="font-medium mb-2">Debug Information</h3>
      <div className="text-sm space-y-1">
        <p>Loading: {loading ? 'true' : 'false'}</p>
        <p>Error: {error || 'none'}</p>
        <p>Reports found: {reportsCount}</p>
        <p>Filtered reports: {filteredCount}</p>
      </div>
    </Card>
  );
}
