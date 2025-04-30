
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
  isPatientView?: boolean;
}

export function ScheduleSessionModal({ open, onClose, onScheduled, isPatientView }: Props) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("50");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("role", "patient");

      if (error) console.error(error);
      else setPatients(data || []);
    };

    if (open) fetchPatients();
  }, [open]);

  const handleSchedule = async () => {
    if (!selectedPatientId || !date || !time || !duration) return;

    const [hours, minutes] = time.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);

    const { error } = await supabase.from("sessions").insert({
      patient_id: selectedPatientId,
      scheduled_time: combinedDate.toISOString(),
      duration_minutes: parseInt(duration),
      notes,
      status: "upcoming"
    });

    if (error) {
      console.error("Failed to schedule session", error);
    } else {
      onScheduled();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Schedule New Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Select Patient */}
          {!isPatientView && (
            <div>
              <Label className="text-gray-700">Patient</Label>
              <select
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pick Date */}
          <div>
            <Label className="text-gray-700">Date</Label>
            <div className="bg-white rounded border p-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="bg-white pointer-events-auto"
              />
            </div>
          </div>

          {/* Time & Duration */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-gray-700">Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white text-gray-800"
              />
            </div>
            <div className="flex-1">
              <Label className="text-gray-700">Duration (min)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white text-gray-800"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-gray-700">Notes</Label>
            <Input
              type="text"
              placeholder="Optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white text-gray-800"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSchedule} 
              className="bg-mood-purple hover:bg-mood-purple/90 text-white"
            >
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
