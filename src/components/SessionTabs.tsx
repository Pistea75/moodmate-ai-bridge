
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionCard } from "@/components/SessionCard";
import { Card } from "@/components/ui/card";

interface SessionTabsProps {
  loading: boolean;
  filtered: {
    upcoming: any[];
    past: any[];
    all: any[];
  };
  selectedDate: Date;
}

export function SessionTabs({ loading, filtered, selectedDate }: SessionTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>

      {/* UPCOMING */}
      <TabsContent value="upcoming">
        <div className="grid gap-4">
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : filtered.upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions for this day.</p>
          ) : (
            filtered.upcoming.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  ...session,
                  patientName: `${session.patient?.first_name} ${session.patient?.last_name}`,
                }}
                variant="clinician"
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* PAST */}
      <TabsContent value="past">
        <div className="grid gap-4">
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : filtered.past.length === 0 ? (
            <p className="text-sm text-muted-foreground">No past sessions.</p>
          ) : (
            filtered.past.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  ...session,
                  patientName: `${session.patient?.first_name} ${session.patient?.last_name}`,
                }}
                variant="clinician"
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* ALL */}
      <TabsContent value="all">
        <div className="grid gap-4">
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : filtered.all.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions found.</p>
          ) : (
            filtered.all.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  ...session,
                  patientName: `${session.patient?.first_name} ${session.patient?.last_name}`,
                }}
                variant="clinician"
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
