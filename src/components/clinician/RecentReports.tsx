
interface RecentReportsProps {
  patients: any[];
}

export function RecentReports({ patients }: RecentReportsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Reports</h2>
        <a href="/clinician/reports" className="text-sm text-mood-purple hover:underline">View All</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                {patient.first_name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{patient.first_name} {patient.last_name}</h3>
                <p className="text-xs text-muted-foreground">Latest report: Apr 20, 2025</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              Patient has shown improvement in managing anxiety symptoms through consistent practice of mindfulness techniques.
            </p>
            <a
              href={`/clinician/reports/${patient.first_name?.toLowerCase()}-${patient.last_name?.toLowerCase()}`}
              className="text-mood-purple text-sm font-medium mt-3 inline-block hover:underline"
            >
              View Full Report
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
