
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, CheckSquare } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Patients */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">Total Patients</p>
            <div className="text-3xl font-bold text-blue-900">
              {loadingPatients ? <Skeleton className="h-8 w-16" /> : patientCount}
            </div>
          </div>
          <div className="p-3 bg-blue-200 rounded-full">
            <Users className="h-6 w-6 text-blue-700" />
          </div>
        </div>
      </div>

      {/* Sessions Today */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">Sessions Today</p>
            <div className="text-3xl font-bold text-green-900">
              {loadingSessions ? <Skeleton className="h-8 w-16" /> : sessionCount}
            </div>
          </div>
          <div className="p-3 bg-green-200 rounded-full">
            <Calendar className="h-6 w-6 text-green-700" />
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600 mb-1">Pending Tasks</p>
            <div className="text-3xl font-bold text-orange-900">
              {loadingTasks ? <Skeleton className="h-8 w-16" /> : pendingTaskCount}
            </div>
          </div>
          <div className="p-3 bg-orange-200 rounded-full">
            <CheckSquare className="h-6 w-6 text-orange-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
