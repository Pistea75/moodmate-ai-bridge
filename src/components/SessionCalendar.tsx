
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
