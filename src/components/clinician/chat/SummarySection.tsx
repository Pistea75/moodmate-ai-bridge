
import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChatExportPDF } from './ChatExportPDF';
import { EnhancedSummaryDisplay } from './EnhancedSummaryDisplay';
import { Eye, EyeOff } from 'lucide-react';

interface ChatSummarySectionProps {
  summary: string | null;
  summarizing: boolean;
  logs: any[];
  savingReport: boolean;
  patientName?: string;
  onSummarize: () => void;
  onSaveReport: () => void;
}

export const SummarySection: FC<ChatSummarySectionProps> = ({ 
  summary, 
  summarizing, 
  logs, 
  savingReport,
  patientName = "Patient", 
  onSummarize, 
  onSaveReport 
}) => {
  const [showEnhanced, setShowEnhanced] = useState(false);

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
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Clinical Summary:</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEnhanced(!showEnhanced)}
              className="flex items-center gap-2"
            >
              {showEnhanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showEnhanced ? 'Simple View' : 'Enhanced View'}
            </Button>
          </div>
          
          {showEnhanced ? (
            <EnhancedSummaryDisplay 
              summary={summary} 
              patientName={patientName}
              clinicianName="Dr. Martinez"
            />
          ) : (
            <div className="p-4 bg-primary/5 rounded-md border">
              <div className="text-sm whitespace-pre-line">{summary}</div>
            </div>
          )}
          
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
