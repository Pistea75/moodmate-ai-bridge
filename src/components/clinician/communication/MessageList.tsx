
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Phone, Mail, Users, Bell } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  type: 'message' | 'reminder' | 'alert';
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  sender_name?: string;
  recipient_name?: string;
}

interface MessageListProps {
  messages: Message[];
}

const getMessageIcon = (type: string) => {
  switch (type) {
    case 'alert':
      return <Bell className="h-4 w-4 text-red-500" />;
    case 'reminder':
      return <Phone className="h-4 w-4 text-blue-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-green-500" />;
  }
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No messages yet. Start a conversation with your patients.
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3 p-4 border rounded-lg">
            {getMessageIcon(message.type)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{message.sender_name}</span>
                <Badge variant={message.status === 'read' ? 'secondary' : 'default'}>
                  {message.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{message.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
