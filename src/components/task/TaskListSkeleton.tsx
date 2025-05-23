
import { Skeleton } from '@/components/ui/skeleton';

export function TaskListSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="p-3 rounded-lg border">
            <div className="flex items-start gap-3">
              <Skeleton className="size-5 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
