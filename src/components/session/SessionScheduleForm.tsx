import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "./DateTimePicker";
import { TimezoneSelector } from "./TimezoneSelector";
import { PatientSelector } from "./PatientSelector";
import { SessionTypeSelector } from "./SessionTypeSelector";
import { getCurrentTimezone } from "@/utils/sessionUtils";
import { useToast } from "@/hooks/use-toast";

export interface SessionFormData {
  date: Date;
  time: string;
  patientId: string;
  timezone: string;
  sessionType: 'online' | 'in_person';
  recordingEnabled: boolean;
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
    timezone: getCurrentTimezone(),
    sessionType: 'online',
    recordingEnabled: true
  });

  useEffect(() => {
    if (onDateChange && formData.date && !isPatientView) {
      onDateChange(formData.date, formData.patientId);
    }
  }, [formData.date, formData.patientId]);

  const handleSubmit = async () => {
    console.log("🕐 Submitting session with timezone:", formData.timezone);
    console.log("📅 Form data being submitted:", formData);
    
    // Validate date
    if (!formData.date) {
      toast({ title: "Missing Date", description: "Please select a date", variant: "destructive" });
      return;
    }

    if (isNaN(formData.date.getTime())) {
      toast({ title: "Invalid Date", description: "Please select a valid date", variant: "destructive" });
      return;
    }

    // Validate time
    if (!formData.time || formData.time.trim() === '') {
      toast({ title: "Missing Time", description: "Please select a time", variant: "destructive" });
      return;
    }

    // Validate time format
    const timeMatch = formData.time.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      toast({ title: "Invalid Time", description: "Please select a valid time format (HH:MM)", variant: "destructive" });
      return;
    }

    if (!isPatientView && !formData.patientId) {
      toast({ title: "Missing Patient", description: "Please select a patient", variant: "destructive" });
      return;
    }

    if (!formData.timezone) {
      toast({ title: "Missing Timezone", description: "Please select a timezone", variant: "destructive" });
      return;
    }

    if (bookedSlots[formData.time]) {
      toast({ title: "Time slot unavailable", description: "Please choose a different time.", variant: "destructive" });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TimezoneSelector
          value={formData.timezone}
          onChange={(tz) => {
            console.log("🌍 Timezone changed to:", tz);
            setFormData(prev => ({ ...prev, timezone: tz }));
          }}
        />

        <SessionTypeSelector
          sessionType={formData.sessionType}
          recordingEnabled={formData.recordingEnabled}
          onSessionTypeChange={(type) => setFormData(prev => ({ ...prev, sessionType: type }))}
          onRecordingEnabledChange={(enabled) => setFormData(prev => ({ ...prev, recordingEnabled: enabled }))}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
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