
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardKPIsProps {
  patientCount: number;
  sessionCount: number;
  pendingTaskCount: number;
  loadingPatients: boolean;
  loadingSessions: boolean;
  loadingTasks: boolean;
}

export function DashboardKPIs({
  patientCount,
  sessionCount,
  pendingTaskCount,
  loadingPatients,
  loadingSessions,
  loadingTasks
}: DashboardKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl border">
        <div className="text-sm text-muted-foreground">Total Patients</div>
        <div className="text-2xl font-bold mt-1">
          {loadingPatients ? <Skeleton className="h-8 w-16" /> : patientCount}
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border">
        <div className="text-sm text-muted-foreground">Sessions Today</div>
        <div className="text-2xl font-bold mt-1">
          {loadingSessions ? <Skeleton className="h-8 w-16" /> : sessionCount}
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border">
        <div className="text-sm text-muted-foreground">Pending Tasks</div>
        <div className="text-2xl font-bold mt-1">
          {loadingTasks ? <Skeleton className="h-8 w-16" /> : pendingTaskCount}
        </div>
      </div>
    </div>
  );
}
