
import PatientLayout from '../../layouts/PatientLayout';
import { SessionList } from '@/components/session/SessionList';
import { PatientSessionHeader } from '@/components/session/PatientSessionHeader';
import { ScheduleSessionModal } from '@/components/session/ScheduleSessionModal';
import { usePatientSessions } from '@/hooks/usePatientSessionsList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BrodiNudgeSystem } from '@/components/brodi/BrodiNudgeSystem';

export default function PatientSessions() {
  const {
    sessions,
    date,
    setDate,
    loading,
    modalOpen,
    setModalOpen,
    isCheckingConnection,
    getSessionsForDate,
    handleScheduleClick,
    handleScheduleComplete,
    fetchSessions,
    error
  } = usePatientSessions();

  return (
    <PatientLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <PatientSessionHeader 
          date={date}
          onDateChange={setDate}
          onScheduleClick={handleScheduleClick}
          getSessionsForDate={getSessionsForDate}
          isCheckingConnection={isCheckingConnection}
        />

        {/* Error state */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* List of Sessions */}
        <SessionList 
          sessions={sessions}
          date={date}
          loading={loading}
          onScheduleClick={handleScheduleClick}
          onSessionDelete={fetchSessions}
        />
      </div>

      {/* Schedule Session Modal */}
      <ScheduleSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onScheduled={handleScheduleComplete}
        isPatientView={true}
      />
      
      <BrodiNudgeSystem 
        context="session_prep"
        trigger={{ 
          type: 'page_visit', 
          data: { 
            upcomingSessions: sessions?.length || 0,
            currentDate: date 
          } 
        }}
      />
    </PatientLayout>
  );
}
