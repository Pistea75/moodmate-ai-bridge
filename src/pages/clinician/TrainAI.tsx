
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Mic as MicIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TrainAI() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Your message has been processed",
    });
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Train AI Assistant</h1>
          <p className="text-muted-foreground">Customize your AI assistant through conversation</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Voice Training</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Speak to your AI assistant to help it learn your communication style and preferences.
            </p>
            <Button 
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className="w-full bg-mood-purple hover:bg-mood-purple/90"
            >
              {isRecording ? (
                <>
                  <Mic className="mr-2 h-4 w-4 animate-pulse" />
                  Stop Recording
                </>
              ) : (
                <>
                  <MicIcon className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Text Training</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Type messages to train your AI assistant through text-based interactions.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Text-based training will be available soon",
                });
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
