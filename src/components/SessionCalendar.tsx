
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SessionCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  getSessionsForDate: (date: Date) => any[];
}

export function SessionCalendar({ selectedDate, onDateChange, getSessionsForDate }: SessionCalendarProps) {
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
          onSelect={(date) => onDateChange(date || new Date())}
          initialFocus
          className="pointer-events-auto"
          components={{
            DayContent: (props) => {
              // Extract the date from props
              const { date } = props;
              const sessionsOnDate = getSessionsForDate(date);
              
              return (
                <div className="relative flex h-8 w-8 items-center justify-center p-0">
                  {/* Use a standard div without passing the active modifiers */}
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
