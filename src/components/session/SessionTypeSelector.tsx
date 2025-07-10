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
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium mb-2 block">Session Type</Label>
        <div className="flex gap-2">
          {/* Online Session Option */}
          <Card 
            className={`cursor-pointer transition-all border flex-1 ${
              sessionType === 'online' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSessionTypeChange('online')}
          >
            <CardContent className="p-2">
              <div className="flex items-center gap-1 justify-center">
                <Video className={`h-3 w-3 ${
                  sessionType === 'online' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <span className="text-xs">Online</span>
              </div>
            </CardContent>
          </Card>

          {/* In-Person Session Option */}
          <Card 
            className={`cursor-pointer transition-all border flex-1 ${
              sessionType === 'in_person' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSessionTypeChange('in_person')}
          >
            <CardContent className="p-2">
              <div className="flex items-center gap-1 justify-center">
                <Users className={`h-3 w-3 ${
                  sessionType === 'in_person' ? 'text-green-600' : 'text-gray-600'
                }`} />
                <span className="text-xs">In-Person</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recording Options */}
      <div className="border rounded-md p-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {recordingEnabled ? (
              <Mic className="h-3 w-3 text-red-500" />
            ) : (
              <MicOff className="h-3 w-3 text-gray-500" />
            )}
            <Label htmlFor="recording-enabled" className="text-xs">
              Record & AI Analysis
            </Label>
          </div>
          <Switch
            id="recording-enabled"
            checked={recordingEnabled}
            onCheckedChange={onRecordingEnabledChange}
            disabled={disabled}
            className="scale-75"
          />
        </div>
      </div>
    </div>
  );
}