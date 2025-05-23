
import React from 'react';
import { Card } from '@/components/ui/card';

interface PatientTaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    due_date: string;
    completed: boolean;
  }
  formatDate: (dateString: string) => string;
}

export function PatientTaskCard({ task, formatDate }: PatientTaskCardProps) {
  // Check if task is overdue
  const isOverdue = new Date(task.due_date) < new Date() && !task.completed;
  
  return (
    <Card 
      key={task.id} 
      className={`p-4 transition-shadow ${
        task.completed 
          ? 'bg-green-50 border-green-200' 
          : isOverdue
            ? 'bg-red-50 border-red-200'
            : 'bg-white'
      }`}
    >
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
            <span className={`text-xs ${isOverdue ? 'text-red-700 font-medium' : 'text-muted-foreground'}`}>
              {formatDate(task.due_date)}
              {isOverdue && ' (overdue)'}
            </span>
          </div>
          <p className={`text-sm mt-1 ${task.completed ? 'text-muted-foreground' : ''}`}>
            {task.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
