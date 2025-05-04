
import PatientLayout from '../../layouts/PatientLayout';
import { SessionList } from '@/components/session/SessionList';
import { PatientSessionHeader } from '@/components/session/PatientSessionHeader';
import { ScheduleSessionModal } from '@/components/session/ScheduleSessionModal';
import { usePatientSessions } from '@/hooks/usePatientSessions';

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
    handleScheduleComplete
  } = usePatientSessions();

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <PatientSessionHeader 
          date={date}
          onDateChange={setDate}
          onScheduleClick={handleScheduleClick}
          getSessionsForDate={getSessionsForDate}
          isCheckingConnection={isCheckingConnection}
        />

        {/* List of Sessions */}
        <SessionList 
          sessions={sessions}
          date={date}
          loading={loading}
          onScheduleClick={handleScheduleClick}
        />
      </div>

      {/* Schedule Session Modal - using the unified component with isPatientView=true */}
      <ScheduleSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onScheduled={handleScheduleComplete}
        isPatientView={true}
      />
    </PatientLayout>
  );
}
