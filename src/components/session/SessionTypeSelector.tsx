import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Video, 
  Users, 
  Mic,
  MicOff,
  AlertCircle,
  Info
} from 'lucide-react';

interface SessionTypeSelectorProps {
  sessionType: 'online' | 'in_person';
  recordingEnabled: boolean;
  onSessionTypeChange: (type: 'online' | 'in_person') => void;
  onRecordingEnabledChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function SessionTypeSelector({
  sessionType,
  recordingEnabled,
  onSessionTypeChange,
  onRecordingEnabledChange,
  disabled = false
}: SessionTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium mb-3 block">Session Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Online Session Option */}
          <Card 
            className={`cursor-pointer transition-all border-2 ${
              sessionType === 'online' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSessionTypeChange('online')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  sessionType === 'online' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Video className={`h-5 w-5 ${
                    sessionType === 'online' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Online Session</h3>
                  <p className="text-sm text-gray-600">Video call with patient</p>
                </div>
                {sessionType === 'online' && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
              
              {sessionType === 'online' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Info className="h-4 w-4" />
                    <span>Automatic recording and transcription available</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* In-Person Session Option */}
          <Card 
            className={`cursor-pointer transition-all border-2 ${
              sessionType === 'in_person' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSessionTypeChange('in_person')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  sessionType === 'in_person' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Users className={`h-5 w-5 ${
                    sessionType === 'in_person' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">In-Person Session</h3>
                  <p className="text-sm text-gray-600">Face-to-face meeting</p>
                </div>
                {sessionType === 'in_person' && (
                  <Badge variant="secondary">Selected</Badge>
                )}
              </div>
              
              {sessionType === 'in_person' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Info className="h-4 w-4" />
                    <span>Optional audio recording with your device</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recording Options */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {recordingEnabled ? (
              <Mic className="h-4 w-4 text-red-500" />
            ) : (
              <MicOff className="h-4 w-4 text-gray-500" />
            )}
            <Label htmlFor="recording-enabled" className="font-medium">
              Enable Recording & AI Analysis
            </Label>
          </div>
          <Switch
            id="recording-enabled"
            checked={recordingEnabled}
            onCheckedChange={onRecordingEnabledChange}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2"></div>
            <span>
              {sessionType === 'online' 
                ? 'Video call will be automatically recorded'
                : 'You can record audio using your device microphone'
              }
            </span>
          </div>
          
          {recordingEnabled && (
            <>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2"></div>
                <span>Recording will be automatically transcribed using AI</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2"></div>
                <span>AI will generate a session report and insights</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2"></div>
                <span>Recording files are automatically deleted after processing</span>
              </div>
              
              <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-amber-800">
                  <p className="font-medium">Privacy Notice</p>
                  <p className="text-xs">
                    Ensure you have patient consent before recording. All recordings are processed securely and deleted after analysis.
                  </p>
                </div>
              </div>
            </>
          )}

          {!recordingEnabled && (
            <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800">
                <p className="font-medium">Manual Completion</p>
                <p className="text-xs">
                  Without recording, you'll need to manually mark the session as completed when finished.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}