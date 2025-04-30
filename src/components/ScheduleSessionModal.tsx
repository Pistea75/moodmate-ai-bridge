
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface ScheduleSessionModalProps {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
  isPatientView?: boolean; // ✅ optional for patient version
}

export function ScheduleSessionModal({
  open,
  onClose,
  onScheduled,
  isPatientView = false,
}: ScheduleSessionModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [patientId, setPatientId] = useState<string>("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    if (open) {
      if (!isPatientView) {
        fetchPatients();
      } else {
        fetchCurrentPatientId();
      }
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
      console.error("❌ Error fetching patients:", error);
    }

    setLoadingPatients(false);
  };

  const fetchCurrentPatientId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setPatientId(user.id); // 👤 use current patient user ID
    }
  };

  const handleSchedule = async () => {
    if (!date || !time || !patientId) return;

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledTime = new Date(date);
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
    const slots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl p-0 border-0 m-4 my-8">
        <DialogHeader className="border-b px-6 py-4 bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Schedule New Session
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          {!isPatientView && (
            <div className="space-y-2">
              <Label htmlFor="patient" className="text-gray-700 font-medium">
                Select Patient
              </Label>
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
          )}

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-gray-700 font-medium">
              Select Time
            </Label>
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
          <Button
            onClick={handleSchedule}
            disabled={loading || !date || !patientId}
            className="bg-mood-purple hover:bg-mood-purple/90 text-white"
          >
            {loading ? "Scheduling..." : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
