
import React from 'react';
import { Card } from '@/components/ui/card';
import { PatientTaskCard } from './PatientTaskCard';
import { usePatientTasks } from '@/hooks/usePatientTasks';

export function PatientTasksSection({ patientId }: { patientId: string }) {
  const { tasks, loading, error, formatDate } = usePatientTasks(patientId);
  
  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        <div className="h-24 flex items-center justify-center">Loading tasks...</div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
          <p className="text-destructive">Error loading tasks: {error.message}</p>
        </div>
      </Card>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
          <p className="text-muted-foreground">No tasks assigned to this patient.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <PatientTaskCard 
            key={task.id}
            task={task}
            formatDate={formatDate}
          />
        ))}
      </div>
    </Card>
  );
}
