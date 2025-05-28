
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExerciseLog {
  id: string;
  patient_id: string;
  exercise_text: string;
  recommended_at: string;
  completed: boolean | null;
  completed_at: string | null;
  created_at: string;
}

export function useExerciseLogs(patientId: string) {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExerciseLogs = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setExerciseLogs(data || []);
          setError(null);
        }
      } catch (err) {
        setError('Failed to fetch exercise logs');
        console.error('Error fetching exercise logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseLogs();
  }, [patientId]);

  const refreshLogs = () => {
    if (patientId) {
      setLoading(true);
      const fetchExerciseLogs = async () => {
        try {
          const { data, error } = await supabase
            .from('exercise_logs')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

          if (error) {
            setError(error.message);
          } else {
            setExerciseLogs(data || []);
            setError(null);
          }
        } catch (err) {
          setError('Failed to fetch exercise logs');
          console.error('Error fetching exercise logs:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchExerciseLogs();
    }
  };

  return {
    exerciseLogs,
    loading,
    error,
    refreshLogs
  };
}
