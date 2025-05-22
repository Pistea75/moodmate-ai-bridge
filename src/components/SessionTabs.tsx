
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionCard } from "@/components/SessionCard";

interface SessionTabsProps {
  loading: boolean;
  filtered: {
    upcoming: any[];
    past: any[];
    all: any[];
  };
  selectedDate: Date;
  onSessionDelete?: () => void;
}

export function SessionTabs({ loading, filtered, onSessionDelete, selectedDate }: SessionTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>

      {["upcoming", "past", "all"].map((type) => (
        <TabsContent key={type} value={type}>
          <div className="grid gap-4">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : filtered[type].length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No {type} sessions.
              </p>
            ) : (
              filtered[type].map((session: any) => (
                <SessionCard
                  key={session.id}
                  session={{
                    id: session.id,
                    title: `Session with ${session.patient?.first_name || 'Patient'}`,
                    dateTime: session.scheduled_time || '',
                    duration: session.duration_minutes || 50,
                    patientName: session.patient ? 
                      `${session.patient.first_name || ''} ${session.patient.last_name || ''}`.trim() : 
                      'Unknown Patient',
                    status: session.status || 'upcoming',
                    notes: session.notes
                  }}
                  variant="clinician"
                  onDelete={onSessionDelete}
                />
              ))
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
