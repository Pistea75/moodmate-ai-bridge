
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

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
      <DialogContent className="max-w-md bg-white border-0 shadow-xl rounded-lg p-0 overflow-hidden">
        <DialogHeader className="bg-white p-6 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">Schedule New Session</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-5 p-6">
          {/* Select Patient */}
          {!isPatientView && (
            <div>
              <Label className="text-gray-700 font-medium mb-1 block">Patient</Label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-mood-purple focus:border-mood-purple outline-none"
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
            <Label className="text-gray-700 font-medium mb-1 block">Date</Label>
            <div className="bg-white rounded-md border p-1 mx-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="bg-white pointer-events-auto mx-auto"
              />
            </div>
          </div>

          {/* Time & Duration */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-gray-700 font-medium mb-1 block">Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-mood-purple focus:border-mood-purple"
              />
            </div>
            <div className="flex-1">
              <Label className="text-gray-700 font-medium mb-1 block">Duration (min)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-mood-purple focus:border-mood-purple"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-gray-700 font-medium mb-1 block">Notes</Label>
            <Input
              type="text"
              placeholder="Optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-mood-purple focus:border-mood-purple"
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
