
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MOOD_LABELS } from './MoodChartConstants';
import { MoodChartTooltip } from './MoodChartTooltip';
import { ChartData } from './MoodChartUtils';

interface MoodChartViewProps {
  data: ChartData[];
  view: 'daily' | 'weekly';
}

export function MoodChartView({ data, view }: MoodChartViewProps) {
  return (
    <>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(val) => MOOD_LABELS[val - 1]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<MoodChartTooltip />} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#9b87f5"
              strokeWidth={3}
              dot={{ fill: '#7E69AB', strokeWidth: 2, r: 4 }}
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
