
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface DateRangeFilter {
  start: Date | null;
  end: Date | null;
}

interface MoodChartDateFilterProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
}

export function MoodChartDateFilter({ dateRange, onDateRangeChange }: MoodChartDateFilterProps) {
  const formatDateRange = () => {
    if (!dateRange.start && !dateRange.end) {
      return 'Select date range';
    }
    if (dateRange.start && !dateRange.end) {
      return `From ${format(dateRange.start, 'MMM d, yyyy')}`;
    }
    if (!dateRange.start && dateRange.end) {
      return `Until ${format(dateRange.end, 'MMM d, yyyy')}`;
    }
    if (dateRange.start && dateRange.end) {
      // If same date, show as single date
      if (dateRange.start.toDateString() === dateRange.end.toDateString()) {
        return format(dateRange.start, 'MMM d, yyyy');
      }
      return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
    }
    return 'Select date range';
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      onDateRangeChange({ start: null, end: null });
      return;
    }

    onDateRangeChange({
      start: range.from || null,
      end: range.to || null
    });
  };

  const clearFilters = () => {
    onDateRangeChange({ start: null, end: null });
  };

  const setWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6); // Last 7 days including today
    onDateRangeChange({ start, end });
  };

  const setMonth = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29); // Last 30 days including today
    onDateRangeChange({ start, end });
  };

  // Convert our date range format to react-day-picker format
  const dayPickerRange: DateRange | undefined = dateRange.start || dateRange.end ? {
    from: dateRange.start || undefined,
    to: dateRange.end || undefined
  } : undefined;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            <Calendar
              mode="range"
              selected={dayPickerRange}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              className={cn("pointer-events-auto")}
            />
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={setWeek}>
        Week
      </Button>
      
      <Button variant="outline" size="sm" onClick={setMonth}>
        Month
      </Button>

      {(dateRange.start || dateRange.end) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      )}
    </div>
  );
}
