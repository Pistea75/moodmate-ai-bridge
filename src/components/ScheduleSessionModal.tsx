
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { addHours, format } from "date-fns";

interface ScheduleSessionModalProps {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
}

export function ScheduleSessionModal({ open, onClose, onScheduled }: ScheduleSessionModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [patientId, setPatientId] = useState<string>("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Fetch patients when the modal is opened
  useState(() => {
    if (open) {
      fetchPatients();
    }
  });

  const fetchPatients = async () => {
    setLoadingPatients(true);
    const { data, error } = await supabase
      .from("patients")
      .select("id, first_name, last_name");

    if (!error && data) {
      setPatients(data);
    } else {
      console.error("Error fetching patients:", error);
    }
    setLoadingPatients(false);
  };

  const handleSchedule = async () => {
    if (!date || !time || !patientId) return;

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledTime = date ? new Date(date) : new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    setLoading(true);
    const { error } = await supabase.from("sessions").insert({
      patient_id: patientId,
      scheduled_time: scheduledTime.toISOString(),
      status: "scheduled",
      duration_minutes: 50,
    });

    setLoading(false);
    if (error) {
      console.error("❌ Error scheduling session:", error);
    } else {
      onScheduled();
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      slots.push(`${hourStr}:00`);
      slots.push(`${hourStr}:30`);
    }
    return slots;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
          <DialogDescription>
            Create a new therapy session with a patient.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient</Label>
            <Select
              value={patientId}
              onValueChange={setPatientId}
              disabled={loadingPatients}
            >
              <SelectTrigger id="patient">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="mx-auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeSlots().map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={loading || !date || !patientId}>
            {loading ? "Scheduling..." : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
