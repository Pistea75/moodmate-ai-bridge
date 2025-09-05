
import { Session, SessionCard } from '@/components/SessionCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface UpcomingSessionsProps {
  sessions: any[];
  loading: boolean;
}

export function UpcomingSessions({ sessions, loading }: UpcomingSessionsProps) {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t('upcomingSessions')}</h2>
            <p className="text-sm text-gray-500">{t('scheduledAppointmentsToday')}</p>
          </div>
        </div>
        <a 
          href="/clinician/sessions" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          {t('viewAllSessions')}
        </a>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session: any) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {session.patient.first_name} {session.patient.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(session.scheduled_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} • {session.duration_minutes} minutes
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {t('upcoming')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noSessionsScheduled')}</h3>
          <p className="text-gray-500 mb-4">{t('noUpcomingSessionsToday')}</p>
          <a 
            href="/clinician/sessions" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('scheduleSession')}
          </a>
        </div>
      )}
    </div>
  );
}
