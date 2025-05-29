
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
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
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: boolean }>({});

  const handleDateChange = async (date: Date, clinicianId?: string) => {
    if (!date || !clinicianId) return;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("sessions")
      .select("scheduled_time")
      .gte("scheduled_time", start.toISOString())
      .lte("scheduled_time", end.toISOString())
      .eq("clinician_id", clinicianId);

    if (error) {
      console.error("Error fetching sessions:", error);
      return;
    }

    const slots: { [key: string]: boolean } = {};
    data?.forEach((session) => {
      const time = new Date(session.scheduled_time).toTimeString().slice(0, 5);
      slots[time] = true;
    });

    setBookedSlots(slots);
  };

  const handleSchedule = async (formData: SessionFormData) => {
    try {
      setLoading(true);
      setError(null);

      const selectedDate = formData.date;
      const [hours, minutes] = formData.time.split(":").map(Number);

      const scheduledDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes,
        0,
        0
      );

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Could not get current user");

      const clinicianId = isPatientView ? undefined : user.id;

      const { data: conflict, error: conflictError } = await supabase
        .from("sessions")
        .select("*")
        .eq("clinician_id", clinicianId)
        .eq("scheduled_time", scheduledDate.toISOString())
        .maybeSingle();

      if (conflict) {
        throw new Error("This time slot is already booked.");
      }

      const { error: insertError } = await supabase.from("sessions").insert([
        {
          scheduled_time: scheduledDate.toISOString(),
          patient_id: formData.patientId,
          clinician_id: clinicianId,
          timezone: formData.timezone,
          duration_minutes: 50,
          status: "scheduled",
        }
      ]);

      if (insertError) throw insertError;

      toast({ title: "Session Scheduled", description: "Your session was saved." });
      onScheduled();
      onClose();
    } catch (error: any) {
      setError(error.message || "Something went wrong");
      toast({ title: "Error", description: error.message || "Failed to schedule session", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isPatientView ? "Schedule Session" : "Schedule New Session"}</DialogTitle>
          <DialogClose><X className="h-5 w-5" /></DialogClose>
        </DialogHeader>
        <SessionScheduleForm
          onSubmit={handleSchedule}
          onCancel={onClose}
          isPatientView={isPatientView}
          isSubmitting={loading}
          bookedSlots={bookedSlots}
          onDateChange={handleDateChange}
        />
      </DialogContent>
    </Dialog>
  );
}
