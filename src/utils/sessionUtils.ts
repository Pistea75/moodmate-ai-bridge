
/**
 * Main session utilities - imports and re-exports functionality from specialized modules
 */

// Re-export all functions from the specialized modules
export { generateTimeSlots, getCommonTimezones, getCurrentTimezone } from './timeUtils';
export { resolvePatientSessionDetails } from './clinicianPatientUtils';
export { scheduleSession, deleteSession, type ScheduleSessionParams } from './sessionScheduleUtils';
