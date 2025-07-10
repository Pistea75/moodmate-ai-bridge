import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Star, Clock, Users, FileText, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionOutcomeModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  patientName: string;
  sessionType: string;
  onComplete: () => void;
}

interface OutcomeData {
  attendance_status: string;
  outcome_rating: number;
  outcome_notes: string;
  homework_assigned: string;
  next_session_focus: string;
  notes: string;
}

export function SessionOutcomeModal({
  open,
  onClose,
  sessionId,
  patientName,
  sessionType,
  onComplete
}: SessionOutcomeModalProps) {
  const [outcomeData, setOutcomeData] = useState<OutcomeData>({
    attendance_status: 'attended',
    outcome_rating: 3,
    outcome_notes: '',
    homework_assigned: '',
    next_session_focus: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && sessionId) {
      loadSessionData();
    }
  }, [open, sessionId]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      if (data) {
        setOutcomeData({
          attendance_status: data.attendance_status || 'attended',
          outcome_rating: data.outcome_rating || 3,
          outcome_notes: data.outcome_notes || '',
          homework_assigned: data.homework_assigned || '',
          next_session_focus: data.next_session_focus || '',
          notes: data.notes || ''
        });
      }
    } catch (error: any) {
      console.error('Error loading session data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load session data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOutcome = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('sessions')
        .update({
          attendance_status: outcomeData.attendance_status,
          outcome_rating: outcomeData.outcome_rating,
          outcome_notes: outcomeData.outcome_notes,
          homework_assigned: outcomeData.homework_assigned,
          next_session_focus: outcomeData.next_session_focus,
          notes: outcomeData.notes,
          status: outcomeData.attendance_status === 'attended' ? 'completed' : 'cancelled'
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: 'Session Updated',
        description: 'Session outcome has been recorded successfully'
      });

      onComplete();
      onClose();
    } catch (error: any) {
      console.error('Error saving outcome:', error);
      toast({
        title: 'Error',
        description: 'Failed to save session outcome',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStatusIcon = (status: string) => {
    switch (status) {
      case 'attended': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'no_show': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'rescheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Session Outcome - {patientName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Patient:</span>
                  <span className="font-medium">{patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="secondary">{sessionType}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Status */}
            <div className="space-y-2">
              <Label htmlFor="attendance">Attendance Status</Label>
              <Select
                value={outcomeData.attendance_status}
                onValueChange={(value) => setOutcomeData(prev => ({ ...prev, attendance_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attended">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Attended
                    </div>
                  </SelectItem>
                  <SelectItem value="no_show">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      No Show
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      Cancelled
                    </div>
                  </SelectItem>
                  <SelectItem value="rescheduled">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Rescheduled
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {outcomeData.attendance_status === 'attended' && (
              <>
                {/* Outcome Rating */}
                <div className="space-y-3">
                  <Label>Session Outcome Rating</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Poor</span>
                      <span className={`text-2xl font-bold ${getRatingColor(outcomeData.outcome_rating)}`}>
                        {outcomeData.outcome_rating}/5
                      </span>
                      <span className="text-sm text-gray-600">Excellent</span>
                    </div>
                    <Slider
                      value={[outcomeData.outcome_rating]}
                      onValueChange={(value) => setOutcomeData(prev => ({ ...prev, outcome_rating: value[0] }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>

                {/* Outcome Notes */}
                <div className="space-y-2">
                  <Label htmlFor="outcome-notes">Session Notes & Observations</Label>
                  <Textarea
                    id="outcome-notes"
                    placeholder="Key insights, patient responses, breakthrough moments, concerns..."
                    className="min-h-[100px]"
                    value={outcomeData.outcome_notes}
                    onChange={(e) => setOutcomeData(prev => ({ ...prev, outcome_notes: e.target.value }))}
                  />
                </div>

                {/* Homework Assigned */}
                <div className="space-y-2">
                  <Label htmlFor="homework">Homework / Action Items</Label>
                  <Textarea
                    id="homework"
                    placeholder="Specific tasks, exercises, or activities for the patient to complete before next session..."
                    value={outcomeData.homework_assigned}
                    onChange={(e) => setOutcomeData(prev => ({ ...prev, homework_assigned: e.target.value }))}
                  />
                </div>

                {/* Next Session Focus */}
                <div className="space-y-2">
                  <Label htmlFor="next-focus">Next Session Focus</Label>
                  <Textarea
                    id="next-focus"
                    placeholder="Areas to explore, goals to work on, or follow-up topics for the next session..."
                    value={outcomeData.next_session_focus}
                    onChange={(e) => setOutcomeData(prev => ({ ...prev, next_session_focus: e.target.value }))}
                  />
                </div>
              </>
            )}

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="additional-notes">Additional Notes</Label>
              <Textarea
                id="additional-notes"
                placeholder="Any additional observations, clinical notes, or important information..."
                value={outcomeData.notes}
                onChange={(e) => setOutcomeData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveOutcome} disabled={saving}>
                {saving ? 'Saving...' : 'Save Outcome'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}