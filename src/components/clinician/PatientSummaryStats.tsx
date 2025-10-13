
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getStartOfWeek } from '@/lib/utils/dateHelpers';
import { UserCircle } from 'lucide-react';

interface Props {
  patientId: string;
}

interface ClinicianInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function PatientSummaryStats({ patientId }: Props) {
  const [avgMood, setAvgMood] = useState<number | null>(null);
  const [clinician, setclinician] = useState<ClinicianInfo | null>(null);
  const [taskStats, setTaskStats] = useState<{ total: number; completed: number; upcoming: number }>({
    total: 0,
    completed: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const fetchClinicianInfo = async () => {
      // Get the clinician linked to this patient
      const { data: linkData, error: linkError } = await supabase
        .from('patient_clinician_links')
        .select('clinician_id')
        .eq('patient_id', patientId)
        .single();

      if (!linkError && linkData) {
        // Get clinician profile
        const { data: clinicianData, error: clinicianError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('id', linkData.clinician_id)
          .single();

        if (!clinicianError && clinicianData) {
          setclinician(clinicianData);
        }
      }
    };

    const fetchMoodStats = async () => {
      const startOfWeek = getStartOfWeek();
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score')
        .eq('patient_id', patientId)
        .gte('created_at', startOfWeek);

      if (!error && data?.length) {
        const total = data.reduce((sum, entry) => sum + entry.mood_score, 0);
        setAvgMood(total / data.length);
      }
    };

    const fetchTaskStats = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('completed, due_date')
        .eq('patient_id', patientId);

      if (!error && data) {
        const total = data.length;
        const completed = data.filter((t) => t.completed).length;
        const upcoming = data.filter((t) => new Date(t.due_date) > new Date()).length;
        setTaskStats({ total, completed, upcoming });
      }
    };

    fetchClinicianInfo();
    fetchMoodStats();
    fetchTaskStats();
  }, [patientId]);

  return (
    <div className="space-y-4 mb-6">
      {/* Clinician Info Card */}
      {clinician && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
              <UserCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-0.5">Tu Psicólogo Asignado</h4>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {clinician.first_name} {clinician.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{clinician.email}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="text-sm text-muted-foreground mb-1">Estado de Ánimo Promedio (Esta Semana)</h4>
          <p className="text-xl font-semibold">
            {avgMood ? avgMood.toFixed(1) : '—'}
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm text-muted-foreground mb-1">Tareas Completadas</h4>
          <p className="text-xl font-semibold">
            {taskStats.completed} / {taskStats.total}
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm text-muted-foreground mb-1">Tareas Próximas</h4>
          <p className="text-xl font-semibold">{taskStats.upcoming}</p>
        </Card>
      </div>
    </div>
  );
}
