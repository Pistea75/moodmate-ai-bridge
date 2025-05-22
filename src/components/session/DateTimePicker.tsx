
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateTimeSlots } from "@/utils/sessionUtils";

interface DateTimePickerProps {
  date: Date | undefined;
  time: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  bookedSlots?: {[key: string]: boolean};
}

export function DateTimePicker({ date, time, onDateChange, onTimeChange, bookedSlots = {} }: DateTimePickerProps) {
  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Session Date
        </label>
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
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && onDateChange(newDate)}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <Select value={time} onValueChange={onTimeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a time">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {time}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => {
              const isBooked = !!bookedSlots[slot];
              return (
                <SelectItem 
                  key={slot} 
                  value={slot}
                  disabled={isBooked}
                  className={isBooked ? "opacity-50 line-through" : ""}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{slot}</span>
                    {isBooked && <span className="text-xs text-red-500 ml-2">Booked</span>}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
