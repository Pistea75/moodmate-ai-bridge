import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Heart, Sparkles, CheckCircle, MessageCircle } from 'lucide-react';

interface BrodiCharacterProps {
  message: string;
  type: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
  onDismiss: () => void;
  onEngaged: () => void;
  onActionCompleted?: () => void;
  showActions?: boolean;
}

export function BrodiCharacter({ 
  message, 
  type, 
  onDismiss, 
  onEngaged, 
  onActionCompleted,
  showActions = true 
}: BrodiCharacterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expression, setExpression] = useState<'happy' | 'excited' | 'caring' | 'thoughtful'>('happy');

  useEffect(() => {
    setIsVisible(true);
    
    // Set expression based on interaction type
    switch (type) {
      case 'celebration':
        setExpression('excited');
        break;
      case 'mood_reminder':
        setExpression('caring');
        break;
      case 'nudge':
        setExpression('thoughtful');
        break;
      default:
        setExpression('happy');
    }
  }, [type]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleEngage = () => {
    onEngaged();
    if (onActionCompleted) {
      onActionCompleted();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'celebration':
        return <Sparkles className="h-6 w-6 text-yellow-500" />;
      case 'mood_reminder':
        return <Heart className="h-6 w-6 text-red-400" />;
      case 'task_reminder':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <MessageCircle className="h-6 w-6 text-primary" />;
    }
  };

  const getBrodiAvatar = () => {
    const bodyColors = {
      excited: 'from-green-400 to-green-600',
      caring: 'from-blue-400 to-blue-600', 
      thoughtful: 'from-purple-400 to-purple-600',
      happy: 'from-primary to-primary-variant'
    };

    const eyeExpressions = {
      excited: '★ ★',
      caring: '◕ ◕',
      thoughtful: '◐ ◑', 
      happy: '• •'
    };

    return (
      <div className="relative">
        {/* Body - 3D cylindrical robot body peeking from corner */}
        <div className={`
          w-24 h-32 rounded-t-2xl rounded-b-lg 
          bg-gradient-to-b ${bodyColors[expression]}
          border-2 border-white shadow-lg
          relative overflow-hidden
          transform rotate-12 hover:rotate-6 transition-transform duration-300
        `}>
          {/* Head */}
          <div className="w-16 h-16 mx-auto mt-2 rounded-full bg-gradient-to-b from-white to-gray-100 border-2 border-gray-300 relative">
            {/* Screen/Face */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
              <span className="text-green-400 text-xs font-mono">{eyeExpressions[expression]}</span>
            </div>
            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-400 rounded-full">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Body Details */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 space-y-1">
            <div className="w-8 h-2 bg-white/30 rounded-full"></div>
            <div className="w-6 h-1 bg-white/20 rounded-full mx-auto"></div>
            <div className="w-4 h-1 bg-white/20 rounded-full mx-auto"></div>
          </div>
          
          {/* Medical Cross */}
          <div className="absolute bottom-4 right-2 w-4 h-4 bg-white rounded-sm flex items-center justify-center">
            <div className="w-3 h-1 bg-red-500 rounded-full absolute"></div>
            <div className="w-1 h-3 bg-red-500 rounded-full absolute"></div>
          </div>
          
          {/* Arms */}
          <div className="absolute top-16 -left-2 w-3 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full transform -rotate-12"></div>
          <div className="absolute top-16 -right-2 w-3 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full transform rotate-12 animate-bounce"></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`
      fixed bottom-0 right-0 z-50 transition-all duration-500 transform
      ${isVisible ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-8 translate-y-8 opacity-0'}
    `}>
      {/* Brodi 3D Character peeking from corner */}
      <div className="relative">
        <div className="absolute bottom-0 right-0 animate-bounce">
          {getBrodiAvatar()}
        </div>
        
        {/* Speech bubble */}
        <div className="absolute bottom-20 right-6 w-80">
          <Card className="shadow-xl border-primary/20 bg-card/95 backdrop-blur-sm relative">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card rotate-45 border-r border-b border-primary/20"></div>
            
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">Brodi</span>
                    {getIcon()}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="ml-auto h-6 w-6 p-0 hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {message}
                  </p>
                  
                  {showActions && (
                    <div className="flex gap-2">
                      {type === 'mood_reminder' && (
                        <Button
                          size="sm"
                          onClick={handleEngage}
                          className="text-xs"
                        >
                          Log Mood
                        </Button>
                      )}
                      {type === 'task_reminder' && (
                        <Button
                          size="sm"
                          onClick={handleEngage}
                          className="text-xs"
                        >
                          View Tasks
                        </Button>
                      )}
                      {type === 'celebration' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEngage}
                          className="text-xs"
                        >
                          Thanks! 😊
                        </Button>
                      )}
                      {(type === 'nudge' || type === 'random') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEngage}
                          className="text-xs"
                        >
                          Tell me more
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}