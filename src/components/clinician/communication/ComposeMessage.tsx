
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface ComposeMessageProps {
  patients: Patient[];
  selectedPatient: string;
  setSelectedPatient: (patientId: string) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  loading: boolean;
}

export function ComposeMessage({
  patients,
  selectedPatient,
  setSelectedPatient,
  newMessage,
  setNewMessage,
  onSendMessage,
  loading
}: ComposeMessageProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Recipient</label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select a patient...</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Message</label>
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="mt-1"
          rows={4}
        />
      </div>
      
      <Button 
        onClick={onSendMessage} 
        disabled={loading || !selectedPatient || !newMessage.trim()}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </div>
  );
}
