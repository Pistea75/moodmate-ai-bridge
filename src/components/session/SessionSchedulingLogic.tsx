
import { useState } from "react";
import { scheduleSession } from "@/utils/sessionScheduleUtils";
import { useToast } from "@/hooks/use-toast";
import { SessionFormData } from "./SessionScheduleForm";
import { useTimeSlotAvailability } from "./useTimeSlotAvailability";
import { supabase } from "@/integrations/supabase/client";

interface UseSessionSchedulingProps {
  isPatientView?: boolean;
  onScheduled: () => void;
  onClose: () => void;
}

export function useSessionScheduling({ 
  isPatientView = false, 
  onScheduled, 
  onClose 
}: UseSessionSchedulingProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { bookedSlots, updateBookedSlots } = useTimeSlotAvailability();

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

      // Validate the constructed date
      if (isNaN(scheduledDate.getTime())) {
        throw new Error("Failed to create valid scheduled date. Please check your date and time selection.");
      }
      
      // Check if the time slot is already booked
      if (bookedSlots[formData.time]) {
        throw new Error("This time slot is already booked. Please select another time.");
      }
      
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
        finalPatientId = user.id;
      } else {
        finalClinicianId = user.id;
        
        if (!formData.patientId || formData.patientId.trim() === '') {
          throw new Error("Please select a patient");
        }
        finalPatientId = formData.patientId;
      }

      // Call the scheduleSession utility
      await scheduleSession({
        date: scheduledDate.toISOString(),
        time: formData.time,
        patientId: finalPatientId,
        clinicianId: finalClinicianId,
        timezone: formData.timezone,
        sessionType: formData.sessionType,
        recordingEnabled: formData.recordingEnabled,
        isPatientView,
        duration: formData.duration,
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

  return {
    loading,
    error,
    bookedSlots,
    handleSchedule,
    updateBookedSlots
  };
}
