
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ChatExportPDF } from './ChatExportPDF';

interface SummarySectionProps {
  summary: string | null;
  summarizing: boolean;
  logs: any[];
  savingReport: boolean;
  patientName?: string;
  onSummarize: () => void;
  onSaveReport: () => void;
}

export const SummarySection: FC<SummarySectionProps> = ({ 
  summary, 
  summarizing, 
  logs, 
  savingReport,
  patientName = "Patient", 
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
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={onSaveReport}
              disabled={savingReport}
              className="w-full"
            >
              {savingReport ? 'Saving Report...' : 'Save as Report'}
            </Button>
            
            <ChatExportPDF 
              logs={logs} 
              summary={summary} 
              patientName={patientName} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
