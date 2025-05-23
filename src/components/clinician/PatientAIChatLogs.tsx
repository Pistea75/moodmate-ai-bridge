
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatLogList } from './chat/ChatLogList';
import { SummarySection } from './chat/SummarySection';
import { DateRangeFilter } from './chat/DateRangeFilter';
import { usePatientAIChatLogs } from '@/hooks/usePatientAIChatLogs';

export function PatientAIChatLogs({ patientId }: { patientId: string }) {
  const { 
    logs,
    loading,
    summary,
    summarizing,
    savingReport,
    patientName,
    startDate,
    endDate,
    isFilterActive,
    setStartDate,
    setEndDate,
    handleApplyFilter,
    handleClearFilter,
    handleSummarize,
    handleSaveReport
  } = usePatientAIChatLogs(patientId);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">AI Chat History</CardTitle>
      </CardHeader>
      <CardContent>
        <DateRangeFilter 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />
        
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <ChatLogList logs={logs} />
            
            <SummarySection 
              summary={summary}
              summarizing={summarizing}
              logs={logs}
              savingReport={savingReport}
              patientName={patientName}
              onSummarize={handleSummarize}
              onSaveReport={handleSaveReport}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
