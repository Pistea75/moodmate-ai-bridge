
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatLogList } from './chat/ChatLogList';
import { DateRangeFilter } from './chat/DateRangeFilter';
import { SummarySection } from './chat/SummarySection';
import { usePatientAIChatLogs } from '@/hooks/usePatientAIChatLogs';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw, Shield, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export function PatientAIChatLogs({ patientId }: { patientId: string }) {
  const [debugMode, setDebugMode] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState<'private' | 'partial_share' | 'full_share' | null>(null);
  const [loadingPrivacy, setLoadingPrivacy] = useState(true);
  
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

  // Fetch patient's privacy level
  useEffect(() => {
    const fetchPrivacyLevel = async () => {
      setLoadingPrivacy(true);
      const { data } = await supabase
        .from('subscribers')
        .select('privacy_level')
        .eq('user_id', patientId)
        .maybeSingle();
      
      setPrivacyLevel(data?.privacy_level || 'private');
      setLoadingPrivacy(false);
    };

    if (patientId) {
      fetchPrivacyLevel();
    }
  }, [patientId]);

  // Add debugging to verify patientId and logs
  useEffect(() => {
    console.log('PatientAIChatLogs - Patient ID:', patientId);
    console.log('PatientAIChatLogs - Patient ID type:', typeof patientId);
    console.log('PatientAIChatLogs - isLoading:', loading);
    console.log('PatientAIChatLogs - logs count:', logs?.length || 0);
    console.log('PatientAIChatLogs - privacyLevel:', privacyLevel);
  }, [patientId, loading, logs, privacyLevel]);

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
                <div>Filter Active: {isFilterActive ? 'true' : 'false'}</div>
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
        
        {loading || loadingPrivacy ? (
          <LoadingState />
        ) : (
          <>
            {/* Privacy Level Notices */}
            {privacyLevel === 'private' && (
              <Alert className="mb-4 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-900 dark:text-amber-100">Acceso Privado</AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  El paciente ha configurado su privacidad como <strong>Privado</strong>. 
                  No tienes acceso a las conversaciones. Solo puedes ver métricas generales de actividad.
                  <div className="mt-2 text-sm">
                    Para acceder a las conversaciones, el paciente debe cambiar su configuración de privacidad a "Compartir Insights" o "Acceso Completo".
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {privacyLevel === 'partial_share' && (
              <Alert className="mb-4 border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-900 dark:text-blue-100">Compartir Insights</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  El paciente ha configurado su privacidad para <strong>Compartir Insights</strong>.
                  No puedes ver las conversaciones literales, pero puedes generar reportes automáticos con insights y tendencias emocionales usando el botón "Generar Resumen" abajo.
                  <div className="mt-2 text-sm">
                    Los reportes contendrán análisis agregados generados por IA, sin citas textuales del chat.
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {privacyLevel === 'full_share' && logs.length > 0 && (
              <Alert className="mb-4 border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-900 dark:text-green-100">Acceso Completo</AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-200">
                  El paciente te ha dado <strong>Acceso Completo</strong> a sus conversaciones (anonimizadas).
                  Puedes ver el chat completo y generar reportes personalizados con citas del chat.
                </AlertDescription>
              </Alert>
            )}

            {/* Show chat logs only if full_share */}
            {privacyLevel === 'full_share' ? (
              <ChatLogList logs={logs} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Las conversaciones no están disponibles según la configuración de privacidad del paciente.
                </p>
              </div>
            )}

            {/* Summary Section - available for partial_share and full_share */}
            {(privacyLevel === 'partial_share' || privacyLevel === 'full_share') && (
              <SummarySection
                summary={summary}
                summarizing={summarizing}
                logs={logs}
                savingReport={savingReport}
                patientName={patientName}
                onSummarize={handleSummarize}
                onSaveReport={handleSaveReport}
              />
            )}
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
