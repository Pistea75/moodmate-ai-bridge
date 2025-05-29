import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "./DateTimePicker";
import { TimezoneSelector } from "./TimezoneSelector";
import { PatientSelector } from "./PatientSelector";
import { getCurrentTimezone } from "@/utils/sessionUtils";
import { useToast } from "@/hooks/use-toast";

export interface SessionFormData {
  date: Date;
  time: string;
  patientId: string;
  timezone: string;
}

interface SessionScheduleFormProps {
  onSubmit: (formData: SessionFormData) => Promise<void>;
  onCancel: () => void;
  isPatientView?: boolean;
  isSubmitting: boolean;
  bookedSlots?: { [key: string]: boolean };
  onDateChange?: (date: Date, clinicianId?: string) => void;
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
    if (onDateChange && formData.date && !isPatientView) {
      onDateChange(formData.date, formData.patientId);
    }
  }, [formData.date, formData.patientId]);

  const handleSubmit = async () => {
    if (!formData.date) {
      toast({ title: "Missing Date", description: "Please select a date", variant: "destructive" });
      return;
    }

    if (!isPatientView && !formData.patientId) {
      toast({ title: "Missing Patient", description: "Please select a patient", variant: "destructive" });
      return;
    }

    if (bookedSlots[formData.time]) {
      toast({ title: "Time slot unavailable", description: "Please choose a different time.", variant: "destructive" });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {!isPatientView && (
        <PatientSelector value={formData.patientId} onChange={(v) => setFormData(prev => ({ ...prev, patientId: v }))} />
      )}

      <DateTimePicker
        date={formData.date}
        time={formData.time}
        onDateChange={(d) => setFormData(prev => ({ ...prev, date: d }))}
        onTimeChange={(t) => setFormData(prev => ({ ...prev, time: t }))}
        bookedSlots={bookedSlots}
      />

      <TimezoneSelector
        value={formData.timezone}
        onChange={(tz) => setFormData(prev => ({ ...prev, timezone: tz }))}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-mood-purple text-white"
        >
          {isSubmitting ? "Scheduling..." : "Schedule"}
        </Button>
      </div>
    </div>
  );
}
