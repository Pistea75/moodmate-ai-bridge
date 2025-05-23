
import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface SummarySectionProps {
  summary: string | null;
  summarizing: boolean;
  logs: any[];
  savingReport: boolean;
  onSummarize: () => void;
  onSaveReport: () => void;
}

export const SummarySection: FC<SummarySectionProps> = ({ 
  summary, 
  summarizing, 
  logs, 
  savingReport, 
  onSummarize, 
  onSaveReport 
}) => {
  return (
    <div className="mt-4 pt-4 border-t space-y-4">
      <Button 
        onClick={onSummarize} 
        disabled={summarizing || logs.length === 0}
        className="w-full"
      >
        {summarizing ? 'Generating Summary...' : 'Generate AI Summary'}
      </Button>
      
      {summary && (
        <div className="space-y-3">
          <div className="p-4 bg-primary/5 rounded-md border">
            <h4 className="font-medium text-sm mb-2">Clinical Summary:</h4>
            <div className="text-sm whitespace-pre-line">{summary}</div>
          </div>
          
          <Button
            variant="secondary"
            onClick={onSaveReport}
            disabled={savingReport}
            className="w-full"
          >
            {savingReport ? 'Saving Report...' : 'Save as Report'}
          </Button>
        </div>
      )}
    </div>
  );
};
