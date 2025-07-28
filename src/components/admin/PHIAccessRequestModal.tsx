
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Clock, FileText, Shield } from 'lucide-react';
import { PHIAccessRequest } from '@/hooks/useSuperAdmin';

interface PHIAccessRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (request: PHIAccessRequest) => Promise<boolean>;
  patientId: string;
  patientName: string;
}

export function PHIAccessRequestModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  patientId, 
  patientName 
}: PHIAccessRequestModalProps) {
  const [formData, setFormData] = useState<PHIAccessRequest>({
    patient_id: patientId,
    access_type: 'read_chat_logs',
    reason: 'escalated_support',
    justification: '',
    expires_hours: 1
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.justification.trim()) {
      return;
    }

    setLoading(true);
    const success = await onSubmit(formData);
    if (success) {
      onOpenChange(false);
      setFormData({
        patient_id: patientId,
        access_type: 'read_chat_logs',
        reason: 'escalated_support',
        justification: '',
        expires_hours: 1
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Request PHI Access - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">PHI Access Warning</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You are requesting access to Protected Health Information (PHI). This access will be logged and audited for compliance. 
                Only request access if absolutely necessary and provide detailed justification.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="access_type">Access Type</Label>
            <Select 
              value={formData.access_type} 
              onValueChange={(value) => setFormData({...formData, access_type: value as any})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read_chat_logs">Chat Logs</SelectItem>
                <SelectItem value="read_session_notes">Session Notes</SelectItem>
                <SelectItem value="read_mood_entries">Mood Entries</SelectItem>
                <SelectItem value="read_reports">Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Select 
              value={formData.reason} 
              onValueChange={(value) => setFormData({...formData, reason: value as any})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legal_compliance">Legal Compliance (e.g., subpoena)</SelectItem>
                <SelectItem value="user_request">User Request (data export)</SelectItem>
                <SelectItem value="escalated_support">Escalated Support</SelectItem>
                <SelectItem value="system_debug">System Debug (dev/staging only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expires_hours">Access Duration (hours)</Label>
            <Select 
              value={formData.expires_hours?.toString() || '1'} 
              onValueChange={(value) => setFormData({...formData, expires_hours: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="168">1 week (legal cases only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="justification">Detailed Justification *</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
              placeholder="Provide detailed justification for this PHI access request. Include ticket numbers, legal references, or specific technical issues that require this access."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Access will expire automatically after the specified duration</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>This request will be logged in the audit trail</span>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.justification.trim()}>
              {loading ? 'Requesting...' : 'Request Access'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
