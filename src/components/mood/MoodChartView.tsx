
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { MOOD_LABELS } from './MoodChartConstants';
import { MoodChartTooltip } from './MoodChartTooltip';
import { ChartData } from './MoodChartUtils';
import { AlertTriangle } from 'lucide-react';

interface MoodChartViewProps {
  data: ChartData[];
  view: 'daily' | 'weekly';
}

// Custom dot component to show warning icon for flagged entries
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (payload.flagged) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#7E69AB" stroke="#fff" strokeWidth={2} />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#EF4444" fontSize={12}>⚠️</text>
      </g>
    );
  }
  
  return <circle cx={cx} cy={cy} r={4} fill="#7E69AB" stroke="#fff" strokeWidth={2} />;
};

export function MoodChartView({ data, view }: MoodChartViewProps) {
  return (
    <>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(val) => MOOD_LABELS[val - 1]}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<MoodChartTooltip />} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#9b87f5"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ fill: '#6E59A5', r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {view === 'daily' && (
        <div className="mt-3 text-xs text-center text-muted-foreground">
          Daily view (grouped by time)
        </div>
      )}
    </>
  );
}
