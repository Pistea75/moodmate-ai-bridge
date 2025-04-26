
import { useEffect, useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { Skeleton } from "@/components/ui/skeleton"; // 🦴 Import Skeleton
import { supabase } from "@/integrations/supabase/client";
import { startOfDay } from 'date-fns'; // 📅 We'll only show upcoming sessions

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data } = await supabase
        .from('sessions')
        .select(`
          id,
          scheduled_time,
          duration_minutes,
          patient:patient_id (
            id,
            first_name,
            last_name
          )
        `)
        .gte('scheduled_time', startOfDay(new Date()).toISOString());

      setSessions(data || []);
      setLoading(false);
    };

    fetchSessions();
  }, []);

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90">
            Schedule Session
          </Button>
        </div>

        {/* Recording Info */}
        <Card className="p-4 mb-4 bg-muted/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-1">
            <div className="flex-shrink-0 bg-mood-purple/10 p-3 rounded-full">
              <Mic className="h-6 w-6 text-mood-purple" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-base">Session Recording</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Record your therapy sessions to generate AI-powered reports and insights automatically.
                The audio is securely encrypted and can be automatically deleted after processing.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </Card>

        {/* Sessions List */}
        {loading ? (
          <div className="grid gap-4">
            {[...Array(2)].map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid gap-4">
            {sessions.map((session: any) => (
              <SessionCard
                key={session.id}
                session={{
                  id: session.id,
                  title: 'Therapy Session',
                  dateTime: session.scheduled_time,
                  duration: session.duration_minutes,
                  patientName: `${session.patient.first_name} ${session.patient.last_name}`,
                  status: 'upcoming'
                }}
                variant="clinician"
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No upcoming sessions scheduled.</div>
        )}
      </div>
    </ClinicianLayout>
  );
}
