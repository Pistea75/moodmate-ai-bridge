
import { FC } from 'react';

interface LogEntryProps {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export const ChatLogEntry: FC<LogEntryProps> = ({ role, message, created_at }) => {
  return (
    <div className="space-y-1">
      <div
        className={`text-xs font-medium ${
          role === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-primary'
        }`}
      >
        {role === 'user' ? 'Patient' : 'AI Assistant'} • {new Date(created_at).toLocaleString()}
      </div>
      <div className={`p-3 rounded-lg text-sm whitespace-pre-line ${
        role === 'user' 
          ? 'bg-accent text-accent-foreground' 
          : 'bg-muted text-muted-foreground'
      }`}>
        {message}
      </div>
    </div>
  );
};
