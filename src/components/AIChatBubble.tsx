
import { useState } from 'react';
import { User, Bot, Volume2, Pause, Play } from 'lucide-react';

type MessageType = 'user' | 'assistant';

interface AIChatBubbleProps {
  type: MessageType;
  content: string;
  timestamp: Date;
}

export function AIChatBubble({ type, content, timestamp }: AIChatBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlayback = () => {
    // In a real implementation, this would control the text-to-speech
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[85%] md:max-w-[70%] flex gap-2 items-start
        ${type === 'user' ? 'flex-row-reverse' : ''}
      `}>
        {/* Avatar */}
        <div className={`
          size-8 rounded-full flex items-center justify-center flex-shrink-0
          ${type === 'user' 
            ? 'bg-mood-purple text-white' 
            : 'bg-mood-purple-light text-mood-purple'
          }
        `}>
          {type === 'user' ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        {/* Message bubble */}
        <div>
          <div className={`
            px-4 py-2 rounded-2xl text-sm
            ${type === 'user' 
              ? 'bg-mood-purple text-white rounded-tr-none' 
              : 'bg-muted rounded-tl-none'
            }
          `}>
            {content}
            
            {/* Voice control for assistant messages */}
            {type === 'assistant' && (
              <button 
                onClick={togglePlayback}
                className="mt-2 flex items-center gap-1.5 text-xs text-foreground/70 hover:text-foreground"
              >
                {isPlaying ? (
                  <>
                    <Pause size={12} />
                    <span>Pause voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={12} />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`
            text-xs mt-1 text-muted-foreground
            ${type === 'user' ? 'text-right' : ''}
          `}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}
