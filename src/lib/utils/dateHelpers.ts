
export function getStartOfWeek(date = new Date()): string {
  // Clone the date to avoid modifying the original
  const d = new Date(date);
  // Set to the start of the current week (Sunday)
  d.setDate(d.getDate() - d.getDay());
  // Set to midnight (start of day)
  d.setHours(0, 0, 0, 0);
  
  // Return ISO string for database query
  return d.toISOString();
}
