
import { useState } from 'react';
import { AIChatBubble } from '../../components/AIChatBubble';
import PatientLayout from '../../layouts/PatientLayout';
import { Send } from 'lucide-react';

type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

// Sample chat history
const sampleMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'Hello Alex! How are you feeling today?',
    timestamp: new Date(Date.now() - 60000 * 5) // 5 minutes ago
  },
  {
    id: '2',
    type: 'user',
    content: 'I\'m feeling a bit anxious about my presentation tomorrow.',
    timestamp: new Date(Date.now() - 60000 * 4) // 4 minutes ago
  },
  {
    id: '3',
    type: 'assistant',
    content: 'That\'s completely understandable. Public speaking can trigger anxiety for many people. Would you like to talk through some strategies that might help you feel more prepared and confident?',
    timestamp: new Date(Date.now() - 60000 * 3) // 3 minutes ago
  },
  {
    id: '4',
    type: 'user',
    content: 'Yes, that would be helpful.',
    timestamp: new Date(Date.now() - 60000 * 2) // 2 minutes ago
  },
  {
    id: '5',
    type: 'assistant',
    content: 'Great! First, let\'s try a quick breathing exercise to help manage your anxiety. Then we can discuss some preparation strategies that might help you feel more confident for tomorrow. Would you like to start with the breathing exercise?',
    timestamp: new Date(Date.now() - 60000) // 1 minute ago
  }
];

export default function PatientChat() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(newMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Simple function to simulate AI responses
  const getAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('anxious') || lowerMsg.includes('anxiety')) {
      return "It sounds like you're feeling anxious. Would you like to try a quick breathing exercise to help calm your mind? Just take a slow deep breath in for 4 counts, hold for 2, and exhale for 6.";
    }
    
    if (lowerMsg.includes('sad') || lowerMsg.includes('depressed') || lowerMsg.includes('down')) {
      return "I'm sorry to hear you're feeling down. Remember that it's okay to experience these emotions. Would it help to talk about what might be contributing to these feelings?";
    }
    
    if (lowerMsg.includes('happy') || lowerMsg.includes('good') || lowerMsg.includes('great')) {
      return "I'm glad to hear you're feeling well! What positive things have happened today that you'd like to reflect on?";
    }
    
    if (lowerMsg.includes('thank')) {
      return "You're welcome! I'm here to support you whenever you need to talk.";
    }
    
    return "Thank you for sharing. How else can I support you today? Would you like to explore some coping strategies or perhaps just chat about your day?";
  };
  
  return (
    <PatientLayout>
      <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-32px)] flex flex-col">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold">AI Companion</h1>
          <p className="text-muted-foreground">Your supportive chat companion is here to help</p>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
          {messages.map(message => (
            <AIChatBubble
              key={message.id}
              type={message.type}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] md:max-w-[70%] flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-mood-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-2 w-2 bg-mood-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-2 w-2 bg-mood-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <div className="border-t pt-4 bg-background">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-mood-purple"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              className={`rounded-full h-12 w-12 flex items-center justify-center ${
                !newMessage.trim() || isLoading 
                  ? 'bg-muted text-muted-foreground' 
                  : 'bg-mood-purple text-white'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
