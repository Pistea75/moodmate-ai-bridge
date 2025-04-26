
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export default function Sessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          scheduled_time,
          duration_minutes,
          profiles!sessions_patient_id_fkey (first_name, last_name)
        `)
        .gte('scheduled_time', new Date().toISOString())
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching sessions:', error);
      } else {
        console.log('✅ Upcoming Sessions:', data);
        setSessions(data || []);
      }
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const handleScheduleSession = () => {
    toast({
      title: "Session Scheduled",
      description: "New session has been scheduled successfully.",
    });
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90" onClick={handleScheduleSession}>
            Schedule Session
          </Button>
        </div>

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

        <div className="grid gap-4">
          {loading ? (
            <p>Loading sessions...</p>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  id: session.id,
                  title: "Therapy Session",
                  dateTime: session.scheduled_time,
                  duration: session.duration_minutes,
                  patientName: `${session.profiles.first_name} ${session.profiles.last_name}`,
                  status: "upcoming",
                }}
                variant="clinician"
              />
            ))
          ) : (
            <p>No upcoming sessions scheduled.</p>
          )}
        </div>
      </div>
    </ClinicianLayout>
  );
}
