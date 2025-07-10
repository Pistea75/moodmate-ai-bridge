import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneCall, 
  PhoneOff,
  Square,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SessionRecordingControlsProps {
  sessionId: string;
  sessionType: 'online' | 'in_person';
  recordingEnabled: boolean;
  recordingStatus: string;
  onSessionUpdate: () => void;
}

export function SessionRecordingControls({
  sessionId,
  sessionType,
  recordingEnabled,
  recordingStatus,
  onSessionUpdate
}: SessionRecordingControlsProps) {
  const [isRecording, setIsRecording] = useState(recordingStatus === 'recording');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(sessionType === 'online');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startCall = async () => {
    try {
      const constraints = {
        video: sessionType === 'online' && videoEnabled,
        audio: audioEnabled
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && sessionType === 'online') {
        videoRef.current.srcObject = stream;
      }

      setCallActive(true);
      toast({
        title: sessionType === 'online' ? 'Video call started' : 'Audio ready',
        description: recordingEnabled ? 'Recording will begin automatically' : 'Session is active'
      });

      // Auto-start recording if enabled
      if (recordingEnabled) {
        setTimeout(() => startRecording(stream), 1000);
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: 'Error',
        description: 'Failed to access camera/microphone',
        variant: 'destructive'
      });
    }
  };

  const endCall = async () => {
    if (isRecording) {
      await stopRecording();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCallActive(false);
    setRecordingTime(0);

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    // Mark session as completed
    await supabase
      .from('sessions')
      .update({ 
        status: 'completed',
        notes: `Session completed at ${new Date().toLocaleString()}`
      })
      .eq('id', sessionId);

    onSessionUpdate();

    toast({
      title: 'Session ended',
      description: 'Session has been marked as completed'
    });
  };

  const startRecording = async (stream?: MediaStream) => {
    try {
      const currentStream = stream || streamRef.current;
      if (!currentStream) {
        throw new Error('No active stream');
      }

      const recorder = new MediaRecorder(currentStream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await uploadRecording(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Update session status
      await supabase
        .from('sessions')
        .update({ 
          recording_status: 'recording',
          status: 'in_progress'
        })
        .eq('id', sessionId);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: 'Recording started',
        description: 'Session is being recorded'
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording failed',
        description: 'Could not start recording',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }

      await supabase
        .from('sessions')
        .update({ recording_status: 'processing' })
        .eq('id', sessionId);

      toast({
        title: 'Recording stopped',
        description: 'Processing recording for transcription...'
      });
    }
  };

  const uploadRecording = async (blob: Blob) => {
    try {
      // Convert blob to base64 for upload
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];

        // Call edge function to process recording
        const { data, error } = await supabase.functions.invoke('process-session-recording', {
          body: {
            sessionId,
            audioData: base64Data,
            duration: recordingTime
          }
        });

        if (error) {
          throw error;
        }

        console.log('Recording uploaded and processing started:', data);
        onSessionUpdate();
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error uploading recording:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload recording',
        variant: 'destructive'
      });

      await supabase
        .from('sessions')
        .update({ recording_status: 'failed' })
        .eq('id', sessionId);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    switch (recordingStatus) {
      case 'recording':
        return <Badge variant="destructive" className="animate-pulse">Recording</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Video display for online sessions */}
      {sessionType === 'online' && (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          {!callActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Click "Start Call" to begin</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recording status and timer */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {isRecording && (
            <div className="flex items-center gap-1 text-red-600">
              <Circle className="h-3 w-3 fill-current animate-pulse" />
              <span className="font-mono">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          {recordingEnabled ? 'Recording enabled' : 'No recording'}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-3">
        {!callActive ? (
          <Button onClick={startCall} className="gap-2">
            <PhoneCall className="h-4 w-4" />
            Start {sessionType === 'online' ? 'Video Call' : 'Session'}
          </Button>
        ) : (
          <>
            {sessionType === 'online' && (
              <Button
                variant={videoEnabled ? "default" : "secondary"}
                size="sm"
                onClick={toggleVideo}
              >
                {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              variant={audioEnabled ? "default" : "secondary"}
              size="sm"
              onClick={toggleAudio}
            >
              {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            {recordingEnabled && !isRecording && (
              <Button variant="destructive" size="sm" onClick={() => startRecording()}>
                <Circle className="h-4 w-4" />
                Record
              </Button>
            )}

            {recordingEnabled && isRecording && (
              <Button variant="secondary" size="sm" onClick={stopRecording}>
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
            )}

            <Button variant="destructive" onClick={endCall} className="gap-2">
              <PhoneOff className="h-4 w-4" />
              End Session
            </Button>
          </>
        )}
      </div>
    </div>
  );
}