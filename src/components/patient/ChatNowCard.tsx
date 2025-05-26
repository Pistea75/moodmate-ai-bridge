
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ChatNowCard() {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/patient/chat');
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <MessageCircle className="h-5 w-5" />
          Need Support?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Chat with our AI assistant for immediate support and guidance with your mental health journey.
        </p>
        <Button 
          onClick={handleChatClick}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Start Chat Now
        </Button>
      </CardContent>
    </Card>
  );
}
