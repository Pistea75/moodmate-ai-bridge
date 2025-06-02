
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { scheduleSession } from "@/utils/sessionScheduleUtils";
import { useToast } from "@/hooks/use-toast";
import { SessionScheduleForm, SessionFormData } from "@/components/session/SessionScheduleForm";
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
  const [bookedSlots, setBookedSlots] = useState<{[key: string]: boolean}>({});

  const checkTimeSlotAvailability = async (date: Date, clinicianId?: string) => {
    try {
      // Format the date to only include the year, month, and day (without time)
      const dateString = date.toISOString().split('T')[0];
      
      const query = supabase
        .from("sessions")
        .select("scheduled_time");
      
      // If clinicianId is provided and valid, filter by that clinician
      if (clinicianId && clinicianId.trim() !== '') {
        query.eq("clinician_id", clinicianId);
      }
      
      // Filter by date (using the date part of scheduled_time)
      query.gte("scheduled_time", `${dateString}T00:00:00Z`)
           .lt("scheduled_time", `${dateString}T23:59:59Z`);
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error checking time slots:", error);
        return {};
      }
      
      // Create a map of booked time slots in the format "HH:MM"
      const slots: {[key: string]: boolean} = {};
      if (data) {
        data.forEach((session) => {
          const sessionTime = new Date(session.scheduled_time);
          const hours = String(sessionTime.getUTCHours()).padStart(2, '0');
          const minutes = String(sessionTime.getUTCMinutes()).padStart(2, '0');
          const timeKey = `${hours}:${minutes}`;
          slots[timeKey] = true;
        });
      }
      
      return slots;
    } catch (error) {
      console.error("Error in checkTimeSlotAvailability:", error);
      return {};
    }
  };

  const updateBookedSlots = async (date: Date, clinicianId?: string) => {
    const slots = await checkTimeSlotAvailability(date, clinicianId);
    setBookedSlots(slots);
  };

  const handleSchedule = async (formData: SessionFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required inputs
      if (!formData.date) {
        throw new Error("Please select a date");
      }
      
      if (!formData.timezone) {
        throw new Error("Please select a timezone");
      }

      if (!formData.time || formData.time.trim() === '') {
        throw new Error("Please select a time");
      }
      
      // Validate date is a valid Date object
      if (isNaN(formData.date.getTime())) {
        throw new Error("Invalid date selected");
      }

      // Validate and parse time
      const timeMatch = formData.time.match(/^(\d{1,2}):(\d{2})$/);
      if (!timeMatch) {
        throw new Error("Invalid time format. Please select a valid time.");
      }

      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error("Invalid time values. Please select a valid time.");
      }

      const selectedDate = formData.date;

      // Create a date object representing the local date and time selected
      const scheduledDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes,
        0,
        0
      );

      // Debug logging
      console.log("🧪 Constructed scheduledDate:", scheduledDate);
      console.log("🧪 Is valid date:", !isNaN(scheduledDate.getTime()));
      console.log("📅 Selected local date and time:", scheduledDate.toLocaleString());
      console.log("📅 Selected timezone:", formData.timezone);

      // Validate the constructed date
      if (isNaN(scheduledDate.getTime())) {
        throw new Error("Failed to create valid scheduled date. Please check your date and time selection.");
      }
      
      // Check if the time slot is already booked
      if (bookedSlots[formData.time]) {
        throw new Error("This time slot is already booked. Please select another time.");
      }
      
      console.log("🔄 Scheduling session with isPatientView:", isPatientView);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Error getting current user:", userError);
        throw new Error("Could not get current user information");
      }
      
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Set IDs based on view type
      let finalClinicianId: string | undefined;
      let finalPatientId: string | undefined;
      
      if (isPatientView) {
        // For patient view, the current user is the patient
        finalPatientId = user.id;
        console.log("👨‍🏥 Patient view - setting patient ID to current user:", finalPatientId);
        // clinicianId will be resolved in the scheduleSession utility
      } else {
        // For clinician view, the current user is the clinician
        finalClinicianId = user.id;
        console.log("👩‍⚕️ Clinician view - setting clinician ID to current user:", finalClinicianId);
        
        // Validate that a patient was selected
        if (!formData.patientId || formData.patientId.trim() === '') {
          throw new Error("Please select a patient");
        }
        finalPatientId = formData.patientId;
        console.log("🏥 Selected patient ID:", finalPatientId);
      }

      // Final validation before calling scheduleSession
      console.log("Final datetime:", scheduledDate.toISOString());

      // Call the updated scheduleSession utility
      await scheduleSession({
        date: scheduledDate.toISOString(),
        time: formData.time,
        patientId: finalPatientId,
        clinicianId: finalClinicianId,
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
            bookedSlots={bookedSlots}
            onDateChange={(date, clinicianId) => updateBookedSlots(date, clinicianId)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
