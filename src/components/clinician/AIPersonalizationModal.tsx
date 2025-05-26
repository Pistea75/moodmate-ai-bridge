
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { AIPersonalizationForm } from './AIPersonalizationForm';

interface AIPersonalizationModalProps {
  patientId: string;
  clinicianId?: string;
  trigger?: React.ReactNode;
}

export function AIPersonalizationModal({ patientId, clinicianId, trigger }: AIPersonalizationModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="gap-2">
            <Brain className="h-4 w-4" />
            Personalize AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Personalization</DialogTitle>
        </DialogHeader>
        <AIPersonalizationForm patientId={patientId} clinicianId={clinicianId} />
      </DialogContent>
    </Dialog>
  );
}
