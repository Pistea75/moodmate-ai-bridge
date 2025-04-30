
import { useState, useEffect } from 'react';
import { formatRecordingTime } from '../utils/dateTimeUtils';

export interface SessionDetails {
  dateTime: string;
  duration: number;
}

export function useSessionCard(session: SessionDetails) {
  const [canJoin, setCanJoin] = useState(false);
  const [timeToSession, setTimeToSession] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
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

  // Recording timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // In a real app, save the recording here
      console.log('Recording stopped after:', formatRecordingTime(recordingTime));
      // Show toast notification in a real implementation
    } else {
      // Start recording
      setIsRecording(true);
      console.log('Recording started');
    }
  };

  return {
    canJoin,
    timeToSession,
    isRecording,
    recordingTime,
    handleRecordToggle,
    formatRecordingTime
  };
}
