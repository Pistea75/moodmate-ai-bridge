
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import { MessageList } from "./chat/MessageList";
import { TextInputMode } from "./chat/TextInputMode";
import { VoiceInputMode } from "./chat/VoiceInputMode";
import { useAudioChat } from "@/hooks/useAudioChat";
import { Skeleton } from "@/components/ui/skeleton";

interface AudioChatInterfaceProps {
  isClinicianView?: boolean;
  clinicianName?: string;
  systemPrompt?: string;
}

export function AudioChatInterface({
  isClinicianView,
  clinicianName = "Martinez",
  systemPrompt = "You are Dr. Martinez, a compassionate mental health assistant. Provide supportive and professional responses to the patient."
}: AudioChatInterfaceProps) {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { messages, isLoading, isFetchingHistory, handleSendMessage } = useAudioChat(systemPrompt);

  return (
    <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-32px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        {!isClinicianView && (
          <h1 className="text-2xl font-bold -mb-1">Dr. {clinicianName} AI</h1>
        )}
        <Button variant="outline" size="sm" onClick={() => setIsVoiceMode(!isVoiceMode)} className="gap-2">
          {isVoiceMode ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
        </Button>
      </div>
      
      {isFetchingHistory ? (
        <div className="flex-1 mb-4">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      ) : (
        <MessageList messages={messages} clinicianName={clinicianName} />
      )}

      <div className="flex gap-2">
        {isVoiceMode ? (
          <VoiceInputMode onSendMessage={handleSendMessage} isLoading={isLoading} />
        ) : (
          <TextInputMode onSendMessage={handleSendMessage} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
