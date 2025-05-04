
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
      
      await scheduleSession({
        date: formData.date!,
        time: formData.time,
        patientId: formData.patientId,
        timezone: formData.timezone,
        isPatientView,
      });
      
      onScheduled();
      onClose();
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
