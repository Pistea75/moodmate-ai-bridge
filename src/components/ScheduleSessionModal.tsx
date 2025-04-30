
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

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
  useEffect(() => {
    if (open) {
      fetchPatients();
    }
  }, [open]);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("role", "patient");

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
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl overflow-hidden p-0 border-0">
        <DialogHeader className="border-b px-6 py-4 bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">Schedule New Session</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="patient" className="text-gray-700 font-medium">Select Patient</Label>
            <Select
              value={patientId}
              onValueChange={setPatientId}
              disabled={loadingPatients}
            >
              <SelectTrigger id="patient" className="bg-white">
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
            <Label className="text-gray-700 font-medium">Select Date</Label>
            <div className="bg-white rounded-md border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                className="mx-auto bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-gray-700 font-medium">Select Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time" className="bg-white">
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
        
        <DialogFooter className="bg-gray-50 px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={loading || !date || !patientId} className="bg-mood-purple hover:bg-mood-purple/90 text-white">
            {loading ? "Scheduling..." : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
