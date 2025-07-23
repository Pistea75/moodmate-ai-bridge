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

  const getBrodiEmoji = () => {
    switch (expression) {
      case 'excited':
        return '🎉';
      case 'caring':
        return '💙';
      case 'thoughtful':
        return '🤔';
      default:
        return '😊';
    }
  };

  return (
    <div className={`
      fixed bottom-4 right-4 z-50 transition-all duration-300 transform
      ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
    `}>
      <Card className="w-80 shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl animate-bounce">{getBrodiEmoji()}</span>
              </div>
            </div>
            
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
  );
}