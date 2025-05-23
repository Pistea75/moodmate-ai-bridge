
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface LogEntry {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export function PatientAIChatLogs({ patientId }: { patientId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('ai_chat_logs')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching chat logs:', error);
          return;
        }

        setLogs(data || []);
      } catch (err) {
        console.error('Error in fetchLogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [patientId]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">AI Chat History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">No AI chat history found for this patient.</p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="space-y-1">
                  <div
                    className={`text-xs font-medium ${
                      log.role === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-primary'
                    }`}
                  >
                    {log.role === 'user' ? 'Patient' : 'AI Assistant'} • {new Date(log.created_at).toLocaleString()}
                  </div>
                  <div className={`p-3 rounded-lg text-sm whitespace-pre-line ${
                    log.role === 'user' 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {log.message}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
