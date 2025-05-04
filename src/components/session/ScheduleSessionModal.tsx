
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { TimezoneSelector } from "./TimezoneSelector";
import { PatientSelector } from "./PatientSelector";
import { getCurrentTimezone, scheduleSession } from "@/utils/sessionUtils";
import { useToast } from "@/hooks/use-toast";

interface ScheduleSessionModalProps {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
  isPatientView?: boolean;
}

export function ScheduleSessionModal({
  open,
  onClose,
  onScheduled,
  isPatientView = false,
}: ScheduleSessionModalProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [patientId, setPatientId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState<string>(getCurrentTimezone());

  const handleSchedule = async () => {
    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    if (!isPatientView && !patientId) {
      toast({
        title: "Missing information",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      await scheduleSession({
        date,
        time,
        patientId,
        timezone,
        isPatientView,
      });
      
      onScheduled();
      if (isPatientView) {
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule session",
        variant: "destructive",
      });
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl overflow-hidden p-0 border-0 m-4 my-8">
        <DialogHeader className="border-b px-6 py-4 bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isPatientView ? "Schedule Session" : "Schedule New Session"}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          {/* Patient Selector - Only for clinician view */}
          {!isPatientView && (
            <PatientSelector value={patientId} onChange={setPatientId} />
          )}

          {/* Date and Time Selection */}
          <DateTimePicker
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />

          {/* Timezone Selection */}
          <TimezoneSelector value={timezone} onChange={setTimezone} />
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={loading || !date || (!isPatientView && !patientId)}
            className="bg-mood-purple hover:bg-mood-purple/90 text-white"
          >
            {loading ? "Scheduling..." : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
