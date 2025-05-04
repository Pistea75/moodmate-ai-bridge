
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "./DateTimePicker";
import { TimezoneSelector } from "./TimezoneSelector";
import { PatientSelector } from "./PatientSelector";
import { getCurrentTimezone } from "@/utils/sessionUtils";
import { useToast } from "@/hooks/use-toast";

interface SessionScheduleFormProps {
  onSubmit: (formData: SessionFormData) => Promise<void>;
  onCancel: () => void;
  isPatientView?: boolean;
  isSubmitting: boolean;
}

export interface SessionFormData {
  date: Date | undefined;
  time: string;
  patientId: string;
  timezone: string;
}

export function SessionScheduleForm({ 
  onSubmit, 
  onCancel, 
  isPatientView = false,
  isSubmitting
}: SessionScheduleFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SessionFormData>({
    date: new Date(),
    time: "09:00",
    patientId: "",
    timezone: getCurrentTimezone()
  });

  const handleSubmit = async () => {
    if (!formData.date) {
      toast({
        title: "Missing information",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    if (!isPatientView && !formData.patientId) {
      toast({
        title: "Missing information",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Patient Selector - Only for clinician view */}
        {!isPatientView && (
          <PatientSelector 
            value={formData.patientId} 
            onChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))} 
          />
        )}

        {/* Date and Time Selection */}
        <DateTimePicker
          date={formData.date}
          time={formData.time}
          onDateChange={(date) => setFormData(prev => ({ ...prev, date }))}
          onTimeChange={(time) => setFormData(prev => ({ ...prev, time }))}
        />

        {/* Timezone Selection */}
        <TimezoneSelector 
          value={formData.timezone} 
          onChange={(timezone) => setFormData(prev => ({ ...prev, timezone }))} 
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.date || (!isPatientView && !formData.patientId)}
          className="bg-mood-purple hover:bg-mood-purple/90 text-white"
        >
          {isSubmitting ? "Scheduling..." : "Schedule Session"}
        </Button>
      </div>
    </div>
  );
}
