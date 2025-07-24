
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect } from "react";

interface SessionCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  getSessionsForDate: (date: Date) => any[];
  onCalendarDateChange?: (date: Date) => void;
}

export function SessionCalendar({ 
  selectedDate, 
  onDateChange, 
  getSessionsForDate,
  onCalendarDateChange 
}: SessionCalendarProps) {
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      // Trigger additional refresh if callback provided
      if (onCalendarDateChange) {
        onCalendarDateChange(date);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="flex items-center gap-2"
        >
          <CalendarIcon className="h-4 w-4" />
          {format(selectedDate, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          className="pointer-events-auto"
          components={{
            DayContent: (props) => {
              const { date } = props;
              const sessionsOnDate = getSessionsForDate(date);
              
              return (
                <div className="relative flex h-8 w-8 items-center justify-center p-0">
                  <div className="h-8 w-8 flex items-center justify-center">{date.getDate()}</div>
                  {sessionsOnDate.length > 0 && (
                    <div className="text-[10px] text-center mt-1 absolute bottom-0 text-mood-purple font-semibold">
                      {sessionsOnDate.length}x
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
