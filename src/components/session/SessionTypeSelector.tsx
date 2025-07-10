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
        <Label className="text-sm font-medium mb-2 block">Session Type</Label>
        <div className="grid grid-cols-1 gap-3">
          {/* Online Session Option */}
          <Card 
            className={`cursor-pointer transition-all border ${
              sessionType === 'online' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSessionTypeChange('online')}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Video className={`h-4 w-4 ${
                  sessionType === 'online' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <span className="font-medium text-sm">Online Video Call</span>
                {sessionType === 'online' && (
                  <Badge variant="default" className="ml-auto text-xs">Selected</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* In-Person Session Option */}
          <Card 
            className={`cursor-pointer transition-all border ${
              sessionType === 'in_person' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSessionTypeChange('in_person')}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Users className={`h-4 w-4 ${
                  sessionType === 'in_person' ? 'text-green-600' : 'text-gray-600'
                }`} />
                <span className="font-medium text-sm">In-Person Meeting</span>
                {sessionType === 'in_person' && (
                  <Badge variant="secondary" className="ml-auto text-xs">Selected</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recording Options */}
      <div className="border rounded-lg p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {recordingEnabled ? (
              <Mic className="h-4 w-4 text-red-500" />
            ) : (
              <MicOff className="h-4 w-4 text-gray-500" />
            )}
            <Label htmlFor="recording-enabled" className="text-sm font-medium">
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

        {recordingEnabled && (
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Recording will be automatically transcribed and analyzed</p>
            <p>• AI will generate session insights and reports</p>
            <p>• Files are automatically deleted after processing</p>
          </div>
        )}
      </div>
    </div>
  );
}