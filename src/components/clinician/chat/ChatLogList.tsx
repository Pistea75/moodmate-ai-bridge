
import { FC } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatLogEntry } from './ChatLogEntry';
import { LogEntry } from '@/hooks/usePatientAIChatLogs';

interface ChatLogListProps {
  logs: LogEntry[];
}

export const ChatLogList: FC<ChatLogListProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4 text-center">No AI chat history found for this patient.</p>
    );
  }
  
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {logs.map((log) => (
          <ChatLogEntry
            key={log.id}
            id={log.id}
            role={log.role}
            message={log.message}
            created_at={log.created_at}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
