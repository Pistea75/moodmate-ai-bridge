
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarDayContent } from "./session/CalendarDayContent";

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
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            selectedDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })
          ) : (
            <span>Pick a date</span>
          )}
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
              const { date } = props;
              const sessionsOnDate = getSessionsForDate(date);
              return <CalendarDayContent date={date} sessionsCount={sessionsOnDate.length} />;
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
