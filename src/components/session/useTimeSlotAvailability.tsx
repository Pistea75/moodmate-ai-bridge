
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTimeSlotAvailability() {
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: boolean }>({});

  const checkTimeSlotAvailability = async (date: Date, clinicianId?: string) => {
    try {
      const dateString = date.toISOString().split('T')[0];
      
      const query = supabase
        .from("sessions")
        .select("scheduled_time");
      
      if (clinicianId && clinicianId.trim() !== '') {
        query.eq("clinician_id", clinicianId);
      }
      
      query.gte("scheduled_time", `${dateString}T00:00:00Z`)
           .lt("scheduled_time", `${dateString}T23:59:59Z`);
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error checking time slots:", error);
        return {};
      }
      
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

  return {
    bookedSlots,
    updateBookedSlots
  };
}
