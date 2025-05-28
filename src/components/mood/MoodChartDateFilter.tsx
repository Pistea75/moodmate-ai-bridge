
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface MoodChartDateFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function MoodChartDateFilter({ dateRange, onDateRangeChange }: MoodChartDateFilterProps) {
  const formatDateRange = () => {
    if (!dateRange.start && !dateRange.end) {
      return 'All time';
    }
    if (dateRange.start && !dateRange.end) {
      return `From ${format(dateRange.start, 'MMM d, yyyy')}`;
    }
    if (!dateRange.start && dateRange.end) {
      return `Until ${format(dateRange.end, 'MMM d, yyyy')}`;
    }
    if (dateRange.start && dateRange.end) {
      return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
    }
    return 'Select dates';
  };

  const handleDateSelect = (date: Date | undefined, type: 'start' | 'end') => {
    if (!date) return;
    
    onDateRangeChange({
      ...dateRange,
      [type]: date
    });
  };

  const clearFilters = () => {
    onDateRangeChange({ start: null, end: null });
  };

  const setLastWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    onDateRangeChange({ start, end });
  };

  const setLastMonth = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    onDateRangeChange({ start, end });
  };

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
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Calendar
                mode="single"
                selected={dateRange.start || undefined}
                onSelect={(date) => handleDateSelect(date, 'start')}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Calendar
                mode="single"
                selected={dateRange.end || undefined}
                onSelect={(date) => handleDateSelect(date, 'end')}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={setLastWeek}>
        Last 7 days
      </Button>
      
      <Button variant="outline" size="sm" onClick={setLastMonth}>
        Last 30 days
      </Button>

      {(dateRange.start || dateRange.end) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      )}
    </div>
  );
}
