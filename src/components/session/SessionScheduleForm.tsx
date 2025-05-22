
import { useState, useEffect } from "react";
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
  bookedSlots?: {[key: string]: boolean};
  onDateChange?: (date: Date, clinicianId?: string) => void;
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
  isSubmitting,
  bookedSlots = {},
  onDateChange
}: SessionScheduleFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SessionFormData>({
    date: new Date(),
    time: "09:00",
    patientId: "",
    timezone: getCurrentTimezone()
  });

  useEffect(() => {
    // When date changes or patient selection changes, check for booked slots
    if (onDateChange && formData.date) {
      onDateChange(formData.date, isPatientView ? undefined : formData.patientId);
    }
  }, [formData.date, formData.patientId, isPatientView, onDateChange]);

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

    // Check if the selected time slot is already booked
    if (bookedSlots && bookedSlots[formData.time]) {
      toast({
        title: "Time slot unavailable",
        description: "This time slot is already booked. Please select a different time.",
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
          bookedSlots={bookedSlots}
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
