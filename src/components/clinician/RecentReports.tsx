
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

      {patients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center text-muted-foreground">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-500">Reports will appear here as patients interact with the system.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {patient.first_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{patient.first_name} {patient.last_name}</h3>
                  <p className="text-xs text-muted-foreground">No reports available yet</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Reports will be generated based on patient interactions and mood data.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
