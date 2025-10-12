
import { FC } from 'react';
import { EnhancedSummaryDisplay } from './EnhancedSummaryDisplay';
import { ChatExportPDF } from './ChatExportPDF';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface SummarySectionProps {
  summary: string;
  summarizing: boolean;
  logs: any[];
  savingReport: boolean;
  patientName: string;
  onSummarize: () => void;
  onSaveReport: () => void;
  privacyLevel?: 'private' | 'partial_share' | 'full_share' | null;
}

export const SummarySection: FC<SummarySectionProps> = ({
  summary,
  summarizing,
  logs,
  savingReport,
  patientName,
  onSummarize,
  onSaveReport,
  privacyLevel
}) => {
  // Show button even for 'private' level, but with different messaging
  const canGenerateSummary = privacyLevel !== 'private' && logs.length > 0;
  const showPrivateMessage = privacyLevel === 'private';
  
  return (
    <div className="mt-6 space-y-4">
      {showPrivateMessage && (
        <Alert className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            Aunque el paciente tiene configuración de privacidad "Privado", puedes generar un reporte 
            basado en las fechas seleccionadas arriba. El reporte contendrá análisis de actividad general 
            sin acceso a conversaciones específicas.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resumen de Sesión</h3>
        <div className="flex gap-2">
          <button
            onClick={onSummarize}
            disabled={summarizing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            title={showPrivateMessage ? "Generar reporte basado en datos de actividad" : "Generar resumen de conversaciones"}
          >
            {summarizing ? 'Generando...' : 'Generar Resumen'}
          </button>
          {summary && (
            <button
              onClick={onSaveReport}
              disabled={savingReport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {savingReport ? 'Guardando...' : 'Guardar Reporte'}
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
          {showPrivateMessage 
            ? "Haz clic en 'Generar Resumen' para crear un análisis de actividad basado en las fechas seleccionadas."
            : "Haz clic en 'Generar Resumen' para crear un análisis impulsado por IA de las sesiones de chat."
          }
        </p>
      )}
    </div>
  );
};
