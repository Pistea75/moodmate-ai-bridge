import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SessionRecordingControls } from './SessionRecordingControls';
import { VideoCallInterface } from './VideoCallInterface';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  Users, 
  Mic,
  MicOff,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  FileText,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedSession {
  id: string;
  title: string;
  dateTime: string;
  duration: number;
  patientName: string;
  status: string;
  timezone?: string;
  sessionType?: 'online' | 'in_person';
  recordingEnabled?: boolean;
  recordingStatus?: string;
  transcriptionStatus?: string;
  aiReportStatus?: string;
  notes?: string;
}

interface EnhancedSessionCardProps {
  session: EnhancedSession;
  variant?: 'default' | 'patient' | 'compact';
  showControls?: boolean;
  onSessionUpdate?: () => void;
  onDelete?: () => void;
}

export function EnhancedSessionCard({ 
  session, 
  variant = 'default',
  showControls = false,
  onSessionUpdate,
  onDelete
}: EnhancedSessionCardProps) {
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullNotes, setShowFullNotes] = useState(false);
  const { toast } = useToast();
  
  const sessionDate = new Date(session.dateTime);
  const isToday = new Date().toDateString() === sessionDate.toDateString();
  const isPast = sessionDate < new Date();
  const isUpcoming = !isPast;
  
  const MAX_NOTES_PREVIEW_LENGTH = 100;
  const hasNotes = session.notes && session.notes.length > 0;
  const notesPreview = hasNotes && session.notes!.length > MAX_NOTES_PREVIEW_LENGTH
    ? session.notes!.substring(0, MAX_NOTES_PREVIEW_LENGTH) + '...'
    : session.notes;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecordingStatusIcon = () => {
    switch (session.recordingStatus) {
      case 'recording':
        return <div className="flex items-center gap-1 text-red-600">
          <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
          <span className="text-xs">Recording</span>
        </div>;
      case 'processing':
        return <div className="flex items-center gap-1 text-blue-600">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span className="text-xs">Processing</span>
        </div>;
      case 'completed':
        return <div className="flex items-center gap-1 text-green-600">
          <CheckCircle2 className="h-3 w-3" />
          <span className="text-xs">Analyzed</span>
        </div>;
      case 'failed':
        return <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span className="text-xs">Failed</span>
        </div>;
      default:
        return null;
    }
  };

  const handleStartSession = () => {
    setShowRecordingControls(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', session.id);
      
      if (error) throw error;
      
      toast({
        title: "Session deleted",
        description: "The session has been successfully removed",
      });
      
      onDelete?.();
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete session",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'completed',
          notes: `Session completed manually at ${new Date().toLocaleString()}`
        })
        .eq('id', session.id);
      
      if (error) throw error;
      
      toast({
        title: "Session completed",
        description: "Session has been marked as completed"
      });
      
      onSessionUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update session",
        variant: "destructive"
      });
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                {session.sessionType === 'online' ? (
                  <Video className="h-4 w-4 text-blue-600" />
                ) : (
                  <Users className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium">{session.title}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{format(sessionDate, 'MMM d, h:mm a')}</span>
                  {session.recordingEnabled && (
                    <div className="flex items-center gap-1">
                      <Mic className="h-3 w-3" />
                      <span>Recording</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(session.status)}>
              {session.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {session.sessionType === 'online' ? (
              <Video className="h-5 w-5 text-blue-600" />
            ) : (
              <Users className="h-5 w-5 text-green-600" />
            )}
            <span>{session.title}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(session.status)}>
              {session.status}
            </Badge>
            {session.recordingEnabled && (
              <Badge variant="outline" className="gap-1">
                <Mic className="h-3 w-3" />
                Recording
              </Badge>
            )}
            {isUpcoming && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Session</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this session? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{format(sessionDate, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{format(sessionDate, 'h:mm a')} ({session.duration} min)</span>
          </div>
          {variant !== 'patient' && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{session.patientName}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
              session.sessionType === 'online' 
                ? 'bg-blue-100' 
                : 'bg-green-100'
            }`}>
              {session.sessionType === 'online' ? (
                <Video className="h-2.5 w-2.5 text-blue-600" />
              ) : (
                <Users className="h-2.5 w-2.5 text-green-600" />
              )}
            </div>
            <span className="capitalize">{session.sessionType?.replace('_', ' ') || 'In-person'}</span>
          </div>
        </div>

        {/* Recording Status */}
        {session.recordingEnabled && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {session.recordingEnabled ? (
                <Mic className="h-4 w-4 text-red-500" />
              ) : (
                <MicOff className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm font-medium">Recording & AI Analysis</span>
            </div>
            {getRecordingStatusIcon()}
          </div>
        )}

        {/* Session Controls */}
        {showControls && isUpcoming && isToday && (
          <div className="pt-2 border-t space-y-3">
            {/* Video Call Interface for Online Sessions */}
            {session.sessionType === 'online' && !showRecordingControls && (
              <VideoCallInterface
                sessionId={session.id}
                patientName={session.patientName}
                scheduledTime={session.dateTime}
                onCallStarted={() => setShowRecordingControls(true)}
              />
            )}
            
            {/* Recording Controls */}
            {showRecordingControls ? (
              <SessionRecordingControls
                sessionId={session.id}
                sessionType={session.sessionType || 'in_person'}
                recordingEnabled={session.recordingEnabled || false}
                recordingStatus={session.recordingStatus || 'none'}
                onSessionUpdate={onSessionUpdate || (() => {})}
              />
            ) : session.sessionType === 'in_person' && (
              <Button onClick={handleStartSession} className="w-full gap-2">
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            )}
          </div>
        )}

        {/* Manual completion for non-recording sessions */}
        {showControls && 
         isUpcoming && 
         isToday && 
         !session.recordingEnabled && 
         session.status !== 'completed' && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={handleMarkCompleted}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as Completed
            </Button>
          </div>
        )}

        {/* Processing Status Display */}
        {session.recordingStatus === 'processing' && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="font-medium text-blue-900">Processing Session</span>
            </div>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex items-center justify-between">
                <span>Transcription</span>
                <Badge variant="secondary">
                  {session.transcriptionStatus || 'Pending'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Analysis</span>
                <Badge variant="secondary">
                  {session.aiReportStatus || 'Pending'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Completed Status Display */}
        {session.aiReportStatus === 'completed' && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Session Report Ready</span>
            </div>
            <p className="text-sm text-green-800 mt-1">
              AI analysis completed. Report available in Reports section.
            </p>
          </div>
        )}

        {/* Session Notes Preview */}
        {hasNotes && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Session Notes</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {notesPreview}
              </p>
              {session.notes!.length > MAX_NOTES_PREVIEW_LENGTH && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto mt-2 text-blue-600 hover:text-blue-700"
                  onClick={() => setShowFullNotes(true)}
                >
                  <ChevronDown className="h-3 w-3 mr-1" />
                  View full notes
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Full Notes Dialog */}
      <Dialog open={showFullNotes} onOpenChange={setShowFullNotes}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Session Notes
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {session.notes}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowFullNotes(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}