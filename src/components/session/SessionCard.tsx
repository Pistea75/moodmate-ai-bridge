
import { useState, useEffect } from 'react';
import { SessionMetadata } from './SessionMetadata';
import { SessionStatusIndicator } from './SessionStatusIndicator';
import { RecordingIndicator } from './RecordingIndicator';
import { useSessionCard } from '@/hooks/useSessionCard';

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
  const {
    canJoin,
    timeToSession,
    isRecording,
    recordingTime,
    handleRecordToggle
  } = useSessionCard(session);
  
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
          
          <SessionMetadata
            dateTime={session.dateTime}
            duration={session.duration}
            patientName={session.patientName}
            clinicianName={session.clinicianName}
            variant={variant}
          />
          
          <RecordingIndicator 
            isRecording={isRecording}
            recordingTime={recordingTime}
            timeToSession={timeToSession}
          />
        </div>
        
        <SessionStatusIndicator 
          status={session.status}
          isRecording={isRecording}
          recordingTime={recordingTime}
          timeToSession={timeToSession}
          canJoin={canJoin}
          onRecordToggle={handleRecordToggle}
        />
      </div>
      
      {session.notes && (
        <div className="mt-3 pt-3 border-t text-sm">
          <p className="text-muted-foreground">{session.notes}</p>
        </div>
      )}
    </div>
  );
}
