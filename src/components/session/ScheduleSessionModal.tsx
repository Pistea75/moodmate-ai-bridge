
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { scheduleSession } from "@/utils/sessionUtils";
import { useToast } from "@/hooks/use-toast";
import { SessionScheduleForm, SessionFormData } from "./SessionScheduleForm";

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
  const [loading, setLoading] = useState(false);

  const handleSchedule = async (formData: SessionFormData) => {
    try {
      setLoading(true);

      // 🧠 Combine selected date + time into a proper UTC datetime
      if (!formData.date) {
        throw new Error("Please select a date");
      }
      
      const selectedDate = formData.date;
      const [hours, minutes] = formData.time.split(":").map(Number);

      // Create a new UTC datetime
      const scheduledUTC = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hours,
          minutes,
          0,
          0
        )
      );

      console.log("📅 Final UTC ISO Date:", scheduledUTC.toISOString());
      console.log("🔄 Scheduling session with isPatientView:", isPatientView);

      await scheduleSession({
        date: scheduledUTC.toISOString(), // UTC datetime
        time: formData.time,
        patientId: isPatientView ? undefined : formData.patientId,
        timezone: formData.timezone,
        isPatientView,
      });

      toast({
        title: "Success",
        description: "Session scheduled successfully",
      });
      
      onScheduled();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule session",
        variant: "destructive",
      });
      console.error("❌ Error scheduling session:", error);
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

        <div className="px-6 py-5">
          <SessionScheduleForm 
            onSubmit={handleSchedule}
            onCancel={onClose}
            isPatientView={isPatientView}
            isSubmitting={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
