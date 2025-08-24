import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Crown, Zap } from 'lucide-react';
import { useMessageLimits } from '@/hooks/useMessageLimits';
import { useSubscription } from '@/hooks/useSubscription';

interface MessageLimitIndicatorProps {
  className?: string;
}

export function MessageLimitIndicator({ className }: MessageLimitIndicatorProps) {
  const { messageData, loading } = useMessageLimits();
  const { createCheckout } = useSubscription();

  const handleUpgrade = async () => {
    try {
      await createCheckout('personal');
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  if (loading || messageData.isUnlimited) {
    return null;
  }

  const progressPercentage = messageData.dailyLimit > 0 
    ? (messageData.messagesUsed / messageData.dailyLimit) * 100 
    : 0;

  const isLimitReached = messageData.messagesUsed >= messageData.dailyLimit;

  return (
    <Card className={`border-orange-200 bg-orange-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${isLimitReached ? 'bg-red-100' : 'bg-orange-100'}`}>
            <MessageCircle className={`h-4 w-4 ${isLimitReached ? 'text-red-600' : 'text-orange-600'}`} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Daily Message Limit</h3>
              <span className="text-sm text-gray-600">
                {messageData.messagesUsed}/{messageData.dailyLimit}
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            
            {isLimitReached ? (
              <div className="space-y-2">
                <p className="text-sm text-red-600 font-medium">
                  You've reached your daily limit of {messageData.dailyLimit} messages.
                </p>
                <Button 
                  onClick={handleUpgrade}
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade for Unlimited Messages
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {messageData.dailyLimit - messageData.messagesUsed} messages remaining today
                </p>
                <Button 
                  onClick={handleUpgrade}
                  variant="outline" 
                  size="sm" 
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Get Unlimited Access
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}