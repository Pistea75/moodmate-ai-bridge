
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
import { supabase } from "@/integrations/supabase/client";

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
  const [error, setError] = useState<string | null>(null);

  const handleSchedule = async (formData: SessionFormData) => {
    try {
      setLoading(true);
      setError(null);

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

      // Get the current user (clinician) ID when not in patient view
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Error getting current user:", userError);
        throw new Error("Could not get current user information");
      }
      
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // For clinician view, use the current user's ID as clinicianId
      const clinicianId = isPatientView ? undefined : user.id;
      
      console.log("👨‍⚕️ Using clinician ID:", clinicianId);

      await scheduleSession({
        date: scheduledUTC.toISOString(), // UTC datetime
        time: formData.time,
        patientId: isPatientView ? undefined : formData.patientId,
        clinicianId: clinicianId,
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
      console.error("❌ Error scheduling session:", error);
      setError(error.message || "Failed to schedule session");
      
      toast({
        title: "Error",
        description: error.message || "Failed to schedule session",
        variant: "destructive",
      });
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
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
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
