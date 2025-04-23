
import { Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export type Session = {
  id: string;
  title: string;
  dateTime: string;
  duration: number; // in minutes
  patientName?: string;
  clinicianName?: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

interface SessionCardProps {
  session: Session;
  variant: 'patient' | 'clinician';
}

export function SessionCard({ session, variant }: SessionCardProps) {
  const [canJoin, setCanJoin] = useState(false);
  const [timeToSession, setTimeToSession] = useState<string>('');
  
  // Format session time
  const formatSessionTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Format session date
  const formatSessionDate = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Check if user can join session (within 5 minutes of start time)
  useEffect(() => {
    const checkJoinStatus = () => {
      const sessionTime = new Date(session.dateTime).getTime();
      const currentTime = new Date().getTime();
      const fiveMinutesBeforeInMs = 5 * 60 * 1000;
      
      // Can join if current time is within 5 minutes of session start
      const canJoinNow = currentTime >= (sessionTime - fiveMinutesBeforeInMs) && 
                         currentTime <= (sessionTime + (session.duration * 60 * 1000));
      
      setCanJoin(canJoinNow);
      
      // Calculate time to session
      const timeDiff = sessionTime - currentTime;
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
          setTimeToSession(`${hours}h ${minutes}m`);
        } else {
          setTimeToSession(`${minutes}m`);
        }
      } else {
        setTimeToSession('');
      }
    };
    
    checkJoinStatus();
    const timer = setInterval(checkJoinStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(timer);
  }, [session]);
  
  return (
    <div className={`
      border rounded-xl p-4 ${
        session.status === 'cancelled' 
          ? 'bg-muted/50'
          : 'bg-white'
      }
    `}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-medium ${
            session.status === 'cancelled' ? 'text-muted-foreground' : ''
          }`}>
            {session.title}
          </h3>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formatSessionDate(session.dateTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{formatSessionTime(session.dateTime)} ({session.duration} min)</span>
            </div>
          </div>
          
          {variant === 'clinician' && session.patientName && (
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">Patient: </span>
              <span className="font-medium">{session.patientName}</span>
            </div>
          )}
          
          {variant === 'patient' && session.clinicianName && (
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">With: </span>
              <span className="font-medium">{session.clinicianName}</span>
            </div>
          )}
          
          {!canJoin && timeToSession && (
            <div className="mt-3 text-xs inline-block px-2 py-1 bg-muted rounded">
              Starts in {timeToSession}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          {session.status === 'upcoming' && (
            <button 
              disabled={!canJoin} 
              className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${canJoin 
                  ? 'bg-mood-purple text-white hover:bg-mood-purple-secondary' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              {canJoin ? 'Join Session' : 'Not Yet Available'}
            </button>
          )}
          
          {session.status === 'cancelled' && (
            <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-lg text-xs font-medium">
              Cancelled
            </span>
          )}
          
          {session.status === 'completed' && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
              Completed
            </span>
          )}
        </div>
      </div>
      
      {session.notes && (
        <div className="mt-3 pt-3 border-t text-sm">
          <p className="text-muted-foreground">{session.notes}</p>
        </div>
      )}
    </div>
  );
}
