
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface LogEntry {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export function PatientAIChatLogs({ patientId }: { patientId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

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

        if (data) {
          // Sanitize the data to ensure the role property conforms to LogEntry type
          const sanitized = data.map(log => ({
            ...log,
            role: log.role === 'assistant' ? 'assistant' : 'user'
          })) as LogEntry[];
          
          setLogs(sanitized);
        }
      } catch (err) {
        console.error('Error in fetchLogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [patientId]);

  const handleSummarize = async () => {
    if (logs.length === 0) return;
    
    setSummarizing(true);
    setSummary(null);
    
    try {
      // Format the logs for the OpenAI API
      const formattedLogs = logs.map(log => ({
        role: log.role,
        content: log.message,
      }));

      // Call the Edge Function
      const response = await fetch('/api/functions/v1/summarize-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formattedLogs }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing chat:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSummarizing(false);
    }
  };

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
          <>
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
            
            <div className="mt-4 pt-4 border-t">
              <Button 
                onClick={handleSummarize} 
                disabled={summarizing || logs.length === 0}
                className="w-full"
              >
                {summarizing ? 'Generating Summary...' : 'Generate AI Summary'}
              </Button>
              
              {summary && (
                <div className="mt-4 p-4 bg-primary/5 rounded-md border">
                  <h4 className="font-medium text-sm mb-2">Clinical Summary:</h4>
                  <div className="text-sm whitespace-pre-line">{summary}</div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
