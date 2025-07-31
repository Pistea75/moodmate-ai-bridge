
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "./DateTimePicker";
import { TimezoneSelector } from "./TimezoneSelector";
import { PatientSelector } from "./PatientSelector";
import { SessionTypeSelector } from "./SessionTypeSelector";
import { AvailableTimeSlots } from "./AvailableTimeSlots";
import { getCurrentTimezone } from "@/lib/utils/timezoneUtils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SessionFormData {
  date: Date;
  time: string;
  patientId: string;
  timezone: string;
  sessionType: 'online' | 'in_person';
  recordingEnabled: boolean;
  duration: number;
}

interface SessionScheduleFormProps {
  onSubmit: (formData: SessionFormData) => Promise<void>;
  onCancel: () => void;
  isPatientView?: boolean;
  isSubmitting: boolean;
  bookedSlots?: { [key: string]: boolean };
  onDateChange?: (date: Date, clinicianId?: string) => void;
}

const durationOptions = [
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes (Standard)" },
  { value: 90, label: "90 minutes" }
];

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
    recordingEnabled: true,
    duration: 60 // Default to 60 minutes
  });

  useEffect(() => {
    if (onDateChange && formData.date && !isPatientView) {
      onDateChange(formData.date, formData.patientId);
    }
  }, [formData.date, formData.patientId, onDateChange, isPatientView]);

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

      <AvailableTimeSlots
        selectedDate={formData.date}
        bookedSlots={bookedSlots}
        onTimeSelect={(time) => setFormData(prev => ({ ...prev, time }))}
        selectedTime={formData.time}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="duration">Session Duration</Label>
          <Select
            value={formData.duration.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
