
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PatientTaskCard } from './PatientTaskCard';

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
