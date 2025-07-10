import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Video, 
  Copy, 
  ExternalLink, 
  Users,
  Clock,
  Link
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VideoCallInterfaceProps {
  sessionId: string;
  patientName: string;
  scheduledTime: string;
  onCallStarted: () => void;
}

export function VideoCallInterface({
  sessionId,
  patientName,
  scheduledTime,
  onCallStarted
}: VideoCallInterfaceProps) {
  const [callUrl, setCallUrl] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCallUrl = async () => {
    try {
      setIsGenerating(true);
      
      // Generate a simple room ID (in production, you'd use a proper video calling service)
      const generatedRoomId = `session-${sessionId}-${Date.now()}`;
      const generatedUrl = `https://meet.example.com/room/${generatedRoomId}`;
      
      // Update session with video call details
      const { error } = await supabase
        .from('sessions')
        .update({
          video_call_url: generatedUrl,
          video_call_room_id: generatedRoomId
        })
        .eq('id', sessionId);

      if (error) throw error;

      setCallUrl(generatedUrl);
      setRoomId(generatedRoomId);
      
      toast({
        title: 'Video call link generated',
        description: 'Share the link with your patient to start the session'
      });
    } catch (error: any) {
      console.error('Error generating call URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate video call link',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: 'Video call link has been copied'
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard',
        variant: 'destructive'
      });
    }
  };

  const openVideoCall = () => {
    if (callUrl) {
      window.open(callUrl, '_blank');
      onCallStarted();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-600" />
          Online Video Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>Patient: {patientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Time: {new Date(scheduledTime).toLocaleString()}</span>
          </div>
        </div>

        {/* Video Call URL Generation */}
        {!callUrl ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Generate a video call link to start the online session
            </p>
            <Button 
              onClick={generateCallUrl}
              disabled={isGenerating}
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Video Call Link'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="call-url" className="text-sm font-medium">
                Video Call Link
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="call-url"
                  value={callUrl}
                  readOnly
                  className="bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(callUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={openVideoCall}
                className="flex-1 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Join Video Call
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(callUrl)}
                className="gap-2"
              >
                <Link className="h-4 w-4" />
                Share Link
              </Button>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Share this link with your patient before the session starts.
                They can join directly from any device with a web browser.
              </p>
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Video className="h-3 w-3" />
            Online Session
          </Badge>
          {callUrl && (
            <Badge variant="default" className="gap-1">
              <Link className="h-3 w-3" />
              Link Ready
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}