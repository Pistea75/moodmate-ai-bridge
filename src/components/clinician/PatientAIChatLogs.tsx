
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatLogList } from './chat/ChatLogList';
import { SummarySection } from './chat/SummarySection';
import { DateRangeFilter } from './chat/DateRangeFilter';
import { usePatientAIChatLogs } from '@/hooks/usePatientAIChatLogs';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PatientAIChatLogs({ patientId }: { patientId: string }) {
  const [debugMode, setDebugMode] = useState(false);
  
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
    handleSaveReport,
    refreshLogs
  } = usePatientAIChatLogs(patientId);

  // Add debugging to verify patientId and logs
  useEffect(() => {
    console.log('PatientAIChatLogs - Patient ID:', patientId);
    console.log('PatientAIChatLogs - Patient ID type:', typeof patientId);
    console.log('PatientAIChatLogs - isLoading:', loading);
    console.log('PatientAIChatLogs - logs count:', logs?.length || 0);
  }, [patientId, loading, logs]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">AI Chat History</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refreshLogs()}
              title="Refresh logs"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setDebugMode(!debugMode)}
            >
              {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {debugMode && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Debug Information</AlertTitle>
            <AlertDescription>
              <div className="text-xs font-mono mt-2 space-y-1">
                <div>Patient ID: {patientId}</div>
                <div>Patient ID type: {typeof patientId}</div>
                <div>Loading: {loading ? 'true' : 'false'}</div>
                <div>Log Count: {logs?.length || 0}</div>
                <div>Date Filter Active: {isFilterActive ? 'true' : 'false'}</div>
                <div>Start Date: {startDate?.toISOString() || 'null'}</div>
                <div>End Date: {endDate?.toISOString() || 'null'}</div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      
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
