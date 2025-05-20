
import React from 'react';

export function PatientDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse bg-muted h-8 w-1/3 rounded"></div>
      <div className="animate-pulse bg-muted h-64 w-full rounded"></div>
      <div className="animate-pulse bg-muted h-48 w-full rounded"></div>
    </div>
  );
}
