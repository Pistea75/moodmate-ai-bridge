import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useBrodiInteractions } from '@/hooks/useBrodiInteractions';
import { Loader2 } from 'lucide-react';

export function BrodiSettings() {
  const { preferences, loading, updatePreferences } = useBrodiInteractions();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Unable to load Brodi preferences
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">😊</span>
          Brodi Companion Settings
        </CardTitle>
        <CardDescription>
          Customize how Brodi interacts with you throughout your mental health journey
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Interaction Frequency */}
        <div className="space-y-2">
          <Label htmlFor="frequency">Interaction Frequency</Label>
          <Select
            value={preferences.frequency_preference}
            onValueChange={(value: 'minimal' | 'normal' | 'frequent') =>
              updatePreferences({ frequency_preference: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal - Only important reminders</SelectItem>
              <SelectItem value="normal">Normal - Balanced interactions</SelectItem>
              <SelectItem value="frequent">Frequent - Regular check-ins and encouragement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interaction Style */}
        <div className="space-y-2">
          <Label htmlFor="style">Communication Style</Label>
          <Select
            value={preferences.interaction_style}
            onValueChange={(value: 'professional' | 'friendly' | 'casual') =>
              updatePreferences({ interaction_style: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional - Formal and clinical</SelectItem>
              <SelectItem value="friendly">Friendly - Warm and supportive</SelectItem>
              <SelectItem value="casual">Casual - Relaxed and conversational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interaction Types */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Interaction Types</Label>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="nudge-enabled">General Nudges</Label>
              <p className="text-sm text-muted-foreground">
                Helpful reminders and encouragement
              </p>
            </div>
            <Switch
              id="nudge-enabled"
              checked={preferences.nudge_enabled}
              onCheckedChange={(checked) => updatePreferences({ nudge_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="celebration-enabled">Celebrations</Label>
              <p className="text-sm text-muted-foreground">
                Celebrate your achievements and milestones
              </p>
            </div>
            <Switch
              id="celebration-enabled"
              checked={preferences.celebration_enabled}
              onCheckedChange={(checked) => updatePreferences({ celebration_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mood-reminders">Mood Check-in Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Gentle reminders to log your mood
              </p>
            </div>
            <Switch
              id="mood-reminders"
              checked={preferences.mood_reminders_enabled}
              onCheckedChange={(checked) => updatePreferences({ mood_reminders_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Encouragement to complete your tasks
              </p>
            </div>
            <Switch
              id="task-reminders"
              checked={preferences.task_reminders_enabled}
              onCheckedChange={(checked) => updatePreferences({ task_reminders_enabled: checked })}
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Quiet Hours</Label>
          <p className="text-sm text-muted-foreground">
            Set times when Brodi won't appear (optional)
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet-start">Start Time</Label>
              <Input
                id="quiet-start"
                type="time"
                value={preferences.quiet_hours_start || ''}
                onChange={(e) => updatePreferences({ quiet_hours_start: e.target.value || undefined })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiet-end">End Time</Label>
              <Input
                id="quiet-end"
                type="time"
                value={preferences.quiet_hours_end || ''}
                onChange={(e) => updatePreferences({ quiet_hours_end: e.target.value || undefined })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}