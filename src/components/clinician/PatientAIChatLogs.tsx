
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { ChatLogList } from './chat/ChatLogList';
import { SummarySection } from './chat/SummarySection';

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
  const [savingReport, setSavingReport] = useState(false);

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

  const handleSaveReport = async () => {
    if (!summary || !patientId) return;
    
    setSavingReport(true);
    
    try {
      // Get the current user (clinician)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to save a report");
      }
      
      // Save the report to the database
      const { error } = await supabase
        .from('ai_chat_reports')
        .insert({
          patient_id: patientId,
          clinician_id: user.id,
          title: `AI Chat Summary - ${new Date().toLocaleDateString()}`,
          report_type: 'chat_summary',
          content: summary,
          status: 'completed',
          chat_date: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Success",
        description: "Report saved successfully",
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save report",
        variant: "destructive",
      });
    } finally {
      setSavingReport(false);
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
        ) : (
          <>
            <ChatLogList logs={logs} />
            
            <SummarySection 
              summary={summary}
              summarizing={summarizing}
              logs={logs}
              savingReport={savingReport}
              onSummarize={handleSummarize}
              onSaveReport={handleSaveReport}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
