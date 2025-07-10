
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface ContactsListProps {
  patients: Patient[];
  onMessagePatient: (patientId: string) => void;
}

export function ContactsList({ patients, onMessagePatient }: ContactsListProps) {
  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {patient.first_name?.[0]}{patient.last_name?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium">{patient.first_name} {patient.last_name}</p>
              <p className="text-sm text-muted-foreground">Patient</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onMessagePatient(patient.id)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
