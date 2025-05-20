
import { MOOD_COLORS, MOOD_LABELS } from './MoodChartConstants';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function MoodChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const mood = payload[0].value;
    if (mood === null) {
      return (
        <div className="bg-background p-3 rounded-md shadow-md border">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">No entry</p>
        </div>
      );
    }

    return (
      <div className="bg-background p-3 rounded-md shadow-md border">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: MOOD_COLORS[mood - 1] }}
          />
          <p className="text-sm">{MOOD_LABELS[mood - 1]}</p>
        </div>
      </div>
    );
  }
  return null;
}
