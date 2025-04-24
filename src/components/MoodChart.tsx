
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps,
  Area,
  AreaChart
} from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';

// Mood levels from 1-5
const MOOD_LEVELS = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
const MOOD_COLORS = ['#F87171', '#FCD34D', '#A3E635', '#34D399', '#60A5FA'];

// Sample data - this would come from your backend in a real app
const weeklyData = [
  { day: 'Mon', mood: 2 },
  { day: 'Tue', mood: 3 },
  { day: 'Wed', mood: 4 },
  { day: 'Thu', mood: 3 },
  { day: 'Fri', mood: 5 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 3 },
];

const dailyData = [
  { hour: '8 AM', mood: 3 },
  { hour: '10 AM', mood: 4 },
  { hour: '12 PM', mood: 3 },
  { hour: '2 PM', mood: 2 },
  { hour: '4 PM', mood: 3 },
  { hour: '6 PM', mood: 4 },
  { hour: '8 PM', mood: 5 },
];

// Hourly data for zoom-in view
const hourlyData = [
  { time: '9:00 AM', mood: 3 },
  { time: '9:15 AM', mood: 3 },
  { time: '9:30 AM', mood: 4 },
  { time: '9:45 AM', mood: 4 },
  { time: '10:00 AM', mood: 4 },
  { time: '10:15 AM', mood: 5 },
  { time: '10:30 AM', mood: 4 },
  { time: '10:45 AM', mood: 4 },
  { time: '11:00 AM', mood: 3 },
  { time: '11:15 AM', mood: 3 },
  { time: '11:30 AM', mood: 2 },
  { time: '11:45 AM', mood: 3 },
];

type ChartView = 'weekly' | 'daily' | 'hourly';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const moodValue = payload[0].value as number;
    const moodLabel = MOOD_LEVELS[moodValue - 1];
    const moodColor = MOOD_COLORS[moodValue - 1];
    
    return (
      <div className="bg-background p-3 rounded-md shadow-md border">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <div 
            className="size-3 rounded-full" 
            style={{ backgroundColor: moodColor }} 
          />
          <p className="text-sm">{moodLabel}</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export function MoodChart() {
  const [view, setView] = useState<ChartView>('weekly');
  const [previousView, setPreviousView] = useState<ChartView | null>(null);
  
  const data = 
    view === 'weekly' ? weeklyData : 
    view === 'daily' ? dailyData : hourlyData;
    
  const dataKey = 
    view === 'weekly' ? 'day' : 
    view === 'daily' ? 'hour' : 'time';
  
  const handleZoomIn = () => {
    if (view === 'weekly') {
      setPreviousView('weekly');
      setView('daily');
    } else if (view === 'daily') {
      setPreviousView('daily');
      setView('hourly');
    }
  };
  
  const handleZoomOut = () => {
    if (view === 'hourly') {
      setView('daily');
    } else if (view === 'daily') {
      setView('weekly');
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Mood Timeline</h3>
        <div className="flex gap-2">
          <div className="flex">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomOut}
              disabled={view === 'weekly'}
              className="rounded-r-none border-r-0"
            >
              <ZoomOut size={16} />
              <span className="sr-only">Zoom Out</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomIn}
              disabled={view === 'hourly'}
              className="rounded-l-none"
            >
              <ZoomIn size={16} />
              <span className="sr-only">Zoom In</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'weekly' 
                  ? 'bg-mood-purple text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setView('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'daily' 
                  ? 'bg-mood-purple text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setView('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'hourly' 
                  ? 'bg-mood-purple text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setView('hourly')}
            >
              Hourly
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'weekly' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey={dataKey}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => MOOD_LEVELS[value - 1].split(' ')[0]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#9b87f5"
                strokeWidth={3}
                dot={{ fill: '#7E69AB', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#6E59A5', r: 6 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey={dataKey}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => MOOD_LEVELS[value - 1].split(' ')[0]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#9b87f5"
                fill="url(#colorMood)"
                strokeWidth={3}
                dot={{ fill: '#7E69AB', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#6E59A5', r: 6 }}
              />
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E5DEFF" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {(view === 'daily' || view === 'hourly') && (
        <div className="mt-3 text-xs text-center text-muted-foreground">
          {view === 'hourly' ? 'Hourly zoom view (15-minute intervals)' : 'Daily view (2-hour intervals)'}
        </div>
      )}
    </div>
  );
}
