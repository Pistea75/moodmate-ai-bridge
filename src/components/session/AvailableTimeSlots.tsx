import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
  clinicianName?: string;
}

interface AvailableTimeSlotsProps {
  selectedDate: Date;
  bookedSlots: { [key: string]: boolean };
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

export function AvailableTimeSlots({ 
  selectedDate, 
  bookedSlots, 
  onTimeSelect, 
  selectedTime 
}: AvailableTimeSlotsProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    generateTimeSlots();
  }, [bookedSlots]);

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    
    // Generate slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: !bookedSlots[timeString],
          clinicianName: bookedSlots[timeString] ? 'Dr. Johnson' : undefined
        });
      }
    }
    
    setTimeSlots(slots);
  };

  const getAvailableCount = () => {
    return timeSlots.filter(slot => slot.available).length;
  };

  const getNextAvailableSlot = () => {
    const available = timeSlots.find(slot => slot.available);
    return available?.time;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-purple-600" />
          Available Time Slots
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
          <div>
            <p className="font-medium text-green-800">
              {getAvailableCount()} slots available
            </p>
            {getNextAvailableSlot() && (
              <p className="text-sm text-green-600">
                Next: {getNextAvailableSlot()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600">Available</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? "default" : "outline"}
              className={`h-auto p-3 text-left justify-start ${
                !slot.available 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                  : selectedTime === slot.time
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-purple-50 hover:border-purple-300'
              }`}
              disabled={!slot.available}
              onClick={() => slot.available && onTimeSelect(slot.time)}
            >
              <div className="flex flex-col w-full">
                <span className="font-medium">{slot.time}</span>
                {!slot.available && slot.clinicianName && (
                  <div className="flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" />
                    <span className="text-xs">{slot.clinicianName}</span>
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {getAvailableCount() === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No available slots</p>
            <p className="text-sm">Please select a different date</p>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Booked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}