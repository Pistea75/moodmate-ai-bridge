
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export function PatientTasksSection({ patientId }: { patientId: string }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('patient_id', patientId)
          .order('due_date', { ascending: true });
          
        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [patientId]);
  
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        <div className="h-24 flex items-center justify-center">Loading tasks...</div>
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
        {tasks.map((task: any) => (
          <Card key={task.id} className={`p-4 ${task.completed ? 'bg-muted/50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`mt-1 size-5 rounded-full border flex-shrink-0 ${
                task.completed 
                  ? 'bg-mood-purple border-mood-purple' 
                  : 'border-mood-neutral'
              }`}>
                {task.completed && (
                  <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">{formatDate(task.due_date)}</span>
                </div>
                <p className={`text-sm mt-1 ${task.completed ? 'text-muted-foreground' : ''}`}>
                  {task.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
