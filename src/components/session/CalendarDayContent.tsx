interface CalendarDayContentProps {
  date: Date;
  sessionsCount: number;
}

export function CalendarDayContent({ date, sessionsCount }: CalendarDayContentProps) {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center p-0">
      <div className="h-8 w-8 flex items-center justify-center">{date.getDate()}</div>
      {sessionsCount > 0 && (
        <div className="text-[10px] text-center mt-1 absolute bottom-0 text-mood-purple font-semibold">
          {sessionsCount}x
        </div>
      )}
    </div>
  );
}
