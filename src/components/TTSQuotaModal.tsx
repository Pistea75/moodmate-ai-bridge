import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Mic } from "lucide-react";

interface TTSQuotaModalProps {
  open: boolean;
  onClose: () => void;
}

export function TTSQuotaModal({ open, onClose }: TTSQuotaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Audio Response Unavailable
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Mic className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Audio-to-Text Still Available</p>
              <p className="text-sm text-muted-foreground">
                You can still record audio and send it to the AI. However, AI responses will be text-only due to insufficient OpenAI credits for text-to-speech.
              </p>
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}