import { DateTime } from 'luxon';

/**
 * Converts a UTC date string or Date object to a specific timezone
 */
export function toZonedTime(utcDate: string | Date, timezone: string): Date {
  try {
    const dt = typeof utcDate === 'string' 
      ? DateTime.fromISO(utcDate, { zone: 'utc' })
      : DateTime.fromJSDate(utcDate, { zone: 'utc' });
      
    if (!dt.isValid) {
      console.warn('Invalid date:', utcDate);
      return typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
    }
    
    const zonedDateTime = dt.setZone(timezone);
    return zonedDateTime.toJSDate();
  } catch (error) {
    console.error('Error converting to zoned time:', error);
    return typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  }
}

/**
 * Converts a local date/time to UTC based on the specified timezone
 */
export function fromZonedTime(localDateTime: Date, timezone: string): Date {
  try {
    const dt = DateTime.fromJSDate(localDateTime, { zone: timezone });
    if (!dt.isValid) {
      console.warn('Invalid date object:', localDateTime);
      return localDateTime;
    }
    
    return dt.toUTC().toJSDate();
  } catch (error) {
    console.error('Error converting from zoned time:', error);
    return localDateTime;
  }
}

/**
 * Formats a date in a specific timezone
 */
export function formatInTimeZone(
  date: Date | string, 
  timezone: string, 
  formatStr: string
): string {
  try {
    const dt = typeof date === 'string' 
      ? DateTime.fromISO(date) 
      : DateTime.fromJSDate(date);
    
    if (!dt.isValid) {
      console.warn('Invalid date for formatting:', date);
      return 'Invalid date';
    }
    
    const zonedDateTime = dt.setZone(timezone);
    
    // Convert common date-fns format strings to Luxon format
    const luxonFormat = convertDateFnsFormatToLuxon(formatStr);
    return zonedDateTime.toFormat(luxonFormat);
  } catch (error) {
    console.error('Error formatting date in timezone:', error);
    return 'Invalid date';
  }
}

/**
 * Gets the current user's timezone
 */
export function getCurrentTimezone(): string {
  return DateTime.local().zoneName || 'UTC';
}

/**
 * Gets a list of common timezones with their current offset
 */
export function getCommonTimezones(): Array<{ value: string; label: string; offset: string }> {
  const now = DateTime.utc();
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Mexico_City',
    'America/Bogota',
    'America/Lima',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];

  return timezones.map(tz => {
    const zonedTime = now.setZone(tz);
    const offset = zonedTime.toFormat('ZZ');
    const offsetHours = zonedTime.offset / 60;
    const offsetStr = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`;
    
    return {
      value: tz,
      label: `${tz.replace('_', ' ')} (UTC${offsetStr})`,
      offset
    };
  });
}

/**
 * Converts date-fns format strings to Luxon format strings
 */
function convertDateFnsFormatToLuxon(dateFnsFormat: string): string {
  const formatMap: Record<string, string> = {
    'yyyy': 'yyyy',
    'yy': 'yy',
    'MM': 'MM',
    'MMM': 'MMM',
    'MMMM': 'MMMM',
    'dd': 'dd',
    'd': 'd',
    'HH': 'HH',
    'H': 'H',
    'hh': 'hh',
    'h': 'h',
    'mm': 'mm',
    'm': 'm',
    'ss': 'ss',
    's': 's',
    'a': 'a',
    'aa': 'a',
    'aaa': 'a',
    'PPP': 'DDD',
    'pp': 't',
    'p': 't'
  };

  let luxonFormat = dateFnsFormat;
  Object.entries(formatMap).forEach(([dateFns, luxon]) => {
    luxonFormat = luxonFormat.replace(new RegExp(dateFns, 'g'), luxon);
  });

  return luxonFormat;
}

/**
 * Checks if a date is valid
 */
export function isValidDate(date: Date | string): boolean {
  if (typeof date === 'string') {
    return DateTime.fromISO(date).isValid;
  }
  return DateTime.fromJSDate(date).isValid;
}

/**
 * Creates a DateTime object from date components in a specific timezone
 */
export function createDateTimeInZone(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string
): Date {
  try {
    const dt = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: timezone }
    );
    
    if (!dt.isValid) {
      throw new Error(`Invalid date components: ${year}-${month}-${day} ${hour}:${minute} in ${timezone}`);
    }
    
    return dt.toJSDate();
  } catch (error) {
    console.error('Error creating date in timezone:', error);
    throw error;
  }
}