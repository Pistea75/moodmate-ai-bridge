
import { FC } from 'react';
import { EnhancedSummaryDisplay } from './EnhancedSummaryDisplay';
import { ChatExportPDF } from './ChatExportPDF';

interface SummarySectionProps {
  summary: string;
  summarizing: boolean;
  logs: any[];
  savingReport: boolean;
  patientName: string;
  onSummarize: () => void;
  onSaveReport: () => void;
}

export const SummarySection: FC<SummarySectionProps> = ({
  summary,
  summarizing,
  logs,
  savingReport,
  patientName,
  onSummarize,
  onSaveReport
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Session Summary</h3>
        <div className="flex gap-2">
          <button
            onClick={onSummarize}
            disabled={summarizing || logs.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {summarizing ? 'Generating...' : 'Generate Summary'}
          </button>
          {summary && (
            <button
              onClick={onSaveReport}
              disabled={savingReport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {savingReport ? 'Saving...' : 'Save Report'}
            </button>
          )}
        </div>
      </div>
      
      {summary && (
        <div className="space-y-4">
          <EnhancedSummaryDisplay
            summary={summary}
            patientName={patientName}
            clinicianName="Clinician"
          />
          <div className="flex justify-end">
            <ChatExportPDF 
              logs={logs} 
              summary={summary} 
              patientName={patientName} 
            />
          </div>
        </div>
      )}
      
      {!summary && !summarizing && (
        <p className="text-gray-500 text-sm">
          Click "Generate Summary" to create an AI-powered analysis of the chat sessions.
        </p>
      )}
    </div>
  );
};
