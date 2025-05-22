
import { MoodChart } from '@/components/mood/MoodChart';

interface PatientSpotlightProps {
  selectedPatient: string | null;
  patients: any[];
  onPatientSelect: (patientId: string) => void;
}

export function PatientSpotlight({ selectedPatient, patients, onPatientSelect }: PatientSpotlightProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Patient Spotlight</h2>
        <select 
          className="border rounded-md px-3 py-1 text-sm"
          value={selectedPatient || ''}
          onChange={(e) => onPatientSelect(e.target.value)}
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name}
            </option>
          ))}
        </select>
      </div>
      {selectedPatient ? (
        <MoodChart patientId={selectedPatient} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-4 w-full h-64 flex items-center justify-center text-muted-foreground">
          Select a patient to view their mood data
        </div>
      )}
    </div>
  );
}
