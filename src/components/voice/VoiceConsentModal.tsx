import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VoiceConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
}

export function VoiceConsentModal({ isOpen, onClose, onConsent }: VoiceConsentModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleConsent = async () => {
    if (!agreed || !user) return;

    try {
      setLoading(true);
      
      // Temporarily skip database update until types are generated
      // TODO: Re-enable once Supabase types are updated
      console.log('Voice consent recorded for user:', user.id);

      // Store consent in localStorage for quick access
      localStorage.setItem('voice_consent_given', 'true');
      localStorage.setItem('voice_consent_date', new Date().toISOString());

      toast({
        title: "Consent recorded",
        description: "You can now use voice chat features.",
      });

      onConsent();
      onClose();
    } catch (error) {
      console.error('Error recording consent:', error);
      toast({
        title: "Error",
        description: "Failed to record consent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Chat Consent
          </DialogTitle>
          <DialogDescription>
            Before using voice features, please review and accept our voice processing terms.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Purpose:</strong> We use your voice to transcribe speech to text and provide AI-generated audio responses for better communication.
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy:</strong> Audio is processed in real-time and not stored permanently. Only text transcriptions are saved for conversation history.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-2">What we collect:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Voice recordings (temporarily, for transcription)</li>
              <li>• Text transcriptions (stored permanently)</li>
              <li>• Usage metrics (duration, language, quality)</li>
            </ul>
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-2">Your rights:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Withdraw consent anytime in settings</li>
              <li>• Request deletion of voice transcriptions</li>
              <li>• View processing logs and usage data</li>
            </ul>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="consent" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label htmlFor="consent" className="text-sm leading-relaxed">
              I consent to voice processing as described above and have read the{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConsent}
            disabled={!agreed || loading}
          >
            {loading ? 'Recording...' : 'Accept & Enable Voice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}