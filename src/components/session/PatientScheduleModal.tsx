
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
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface PatientScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
}

export function PatientScheduleModal({
  open,
  onClose,
  onScheduled,
}: PatientScheduleModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!date || !time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledTime = new Date(date);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Step 1: get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error("❌ Could not fetch patient user:", userError);
      return;
    }

    // Step 2: find patient's referral_code
    const { data: patientProfile, error: profileError } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", user.id)
      .eq("role", "patient")
      .single();

    if (!patientProfile || profileError) {
      console.error("❌ Could not get patient's referral code:", profileError);
      return;
    }

    // Step 3: find the clinician with matching referral_code
    const { data: clinician, error: clinicianError } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", patientProfile.referral_code)
      .eq("role", "clinician")
      .single();

    if (!clinician || clinicianError) {
      console.error("❌ No clinician found with referral code", clinicianError);
      return;
    }

    // Step 4: Insert the session
    setLoading(true);
    const { error } = await supabase.from("sessions").insert({
      patient_id: user.id,
      clinician_id: clinician.id,
      scheduled_time: scheduledTime.toISOString(),
      status: "scheduled",
      duration_minutes: 50,
    });

    setLoading(false);

    if (error) {
      console.error("❌ Error scheduling session:", error);
    } else {
      onScheduled(); // Notify parent
      onClose();     // Close modal
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl overflow-hidden p-0 border-0 m-4 my-8">
        <DialogHeader className="border-b px-6 py-4 bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Schedule Session
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          {/* Date Selection */}
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
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
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
            disabled={loading || !date}
            className="bg-mood-purple hover:bg-mood-purple/90 text-white"
          >
            {loading ? "Scheduling..." : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
