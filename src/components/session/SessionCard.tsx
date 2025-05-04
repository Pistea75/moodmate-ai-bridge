
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
  
  // Ensure session data is valid
  const validSession = {
    ...session,
    dateTime: session.dateTime || '',
    duration: session.duration || 50,
    status: session.status || 'upcoming'
  };
  
  return (
    <div className={`
      border rounded-xl p-4 ${
        validSession.status === 'cancelled' 
          ? 'bg-muted/50'
          : 'bg-white'
      }
    `}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-medium ${
            validSession.status === 'cancelled' ? 'text-muted-foreground' : ''
          }`}>
            {validSession.title}
          </h3>
          
          <SessionMetadata
            dateTime={validSession.dateTime}
            duration={validSession.duration}
            patientName={validSession.patientName}
            clinicianName={validSession.clinicianName}
            variant={variant}
          />
          
          <RecordingIndicator 
            isRecording={isRecording}
            recordingTime={recordingTime}
            timeToSession={timeToSession}
          />
        </div>
        
        <SessionStatusIndicator 
          status={validSession.status}
          isRecording={isRecording}
          recordingTime={recordingTime}
          timeToSession={timeToSession}
          canJoin={canJoin}
          onRecordToggle={handleRecordToggle}
        />
      </div>
      
      {validSession.notes && (
        <div className="mt-3 pt-3 border-t text-sm">
          <p className="text-muted-foreground">{validSession.notes}</p>
        </div>
      )}
    </div>
  );
}
