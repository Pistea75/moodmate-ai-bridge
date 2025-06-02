
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { SessionScheduleForm } from "./SessionScheduleForm";
import { useSessionScheduling } from "./SessionSchedulingLogic";

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
  const {
    loading,
    error,
    bookedSlots,
    handleSchedule,
    updateBookedSlots
  } = useSessionScheduling({ isPatientView, onScheduled, onClose });

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
