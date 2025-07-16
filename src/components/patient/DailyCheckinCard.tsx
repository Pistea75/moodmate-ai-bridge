
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function DailyCheckinCard() {
  const navigate = useNavigate();
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    // Check if user has already checked in today
    const lastCheckin = localStorage.getItem('lastDailyCheckin');
    const today = new Date().toDateString();
    setCheckedInToday(lastCheckin === today);
  }, []);

  const handleCheckin = () => {
    const today = new Date().toDateString();
    localStorage.setItem('lastDailyCheckin', today);
    setCheckedInToday(true);
    navigate('/patient/mood');
  };

  return (
    <Card className={`${checkedInToday ? 'bg-green-50 border-green-200' : 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Heart className="h-5 w-5 text-rose-500" />
          Daily Check-in
          {checkedInToday && (
            <Badge className="bg-green-100 text-green-800 ml-auto">
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {checkedInToday ? (
          <div className="space-y-3">
            <p className="text-sm text-green-700">
              Great job! You've completed your daily check-in today. Keep up the good work on your wellness journey.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/patient/mood')}
              className="w-full border-green-200 text-green-700 hover:bg-green-100"
            >
              View Mood History
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              How are you feeling today? Take a moment to check in with yourself and log your mood.
            </p>
            <Button 
              onClick={handleCheckin}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Clock className="h-4 w-4 mr-2" />
              Start Check-in
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
