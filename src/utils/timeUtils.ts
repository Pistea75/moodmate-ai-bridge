
/**
 * Time and timezone related utility functions
 */

/**
 * Generates time slots for session scheduling
 * @returns Array of time slots in format "HH:MM"
 */
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour < 22; hour++) {
    const hourStr = hour.toString().padStart(2, "0");
    slots.push(`${hourStr}:00`);
    slots.push(`${hourStr}:30`);
  }
  return slots;
};

/**
 * Generate all common GMT time zones with city references
 * @returns Array of timezone objects with value and label
 */
export const getCommonTimezones = () => {
  const timezones = [];
  
  // Add all 24 standard GMT time zones
  for (let offset = -12; offset <= 12; offset++) {
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const label = `GMT${sign}${absOffset}`;
    const value = `GMT${sign}${absOffset}`;
    
    // Add major city references for common time zones
    let cities = "";
    if (offset === 0) cities = " (London, UTC)";
    else if (offset === -5) cities = " (New York, Eastern Time)";
    else if (offset === -6) cities = " (Chicago, Central Time)";
    else if (offset === -7) cities = " (Denver, Mountain Time)";
    else if (offset === -8) cities = " (Los Angeles, Pacific Time)";
    else if (offset === +1) cities = " (Berlin, Paris, Rome)";
    else if (offset === +2) cities = " (Athens, Cairo)";
    else if (offset === +3) cities = " (Moscow, Istanbul)";
    else if (offset === +8) cities = " (Beijing, Singapore)";
    else if (offset === +9) cities = " (Tokyo, Seoul)";
    else if (offset === +10) cities = " (Sydney)";
    
    timezones.push({ value, label: label + cities });
  }

  // Add GMT+5:30 for India
  timezones.push({ value: "GMT+5:30", label: "GMT+5:30 (New Delhi, Mumbai)" });
  
  // Add GMT+3:30 for Iran
  timezones.push({ value: "GMT+3:30", label: "GMT+3:30 (Tehran)" });
  
  // Add GMT+4:30 for Afghanistan
  timezones.push({ value: "GMT+4:30", label: "GMT+4:30 (Kabul)" });
  
  // Add GMT+6:30 for Myanmar
  timezones.push({ value: "GMT+6:30", label: "GMT+6:30 (Yangon)" });
  
  // Add GMT+8:45 for Australia (Eucla)
  timezones.push({ value: "GMT+8:45", label: "GMT+8:45 (Eucla)" });
  
  // Add GMT+9:30 for Australia (Darwin)
  timezones.push({ value: "GMT+9:30", label: "GMT+9:30 (Darwin, Adelaide)" });
  
  // Add GMT+10:30 for Australia (Lord Howe Island)
  timezones.push({ value: "GMT+10:30", label: "GMT+10:30 (Lord Howe Island)" });
  
  // Add GMT+11:30 for Norfolk Island
  timezones.push({ value: "GMT+11:30", label: "GMT+11:30 (Norfolk Island)" });
  
  // Add GMT+12:45 for New Zealand (Chatham Islands)
  timezones.push({ value: "GMT+12:45", label: "GMT+12:45 (Chatham Islands)" });
  
  // Sort by offset
  return timezones.sort((a, b) => {
    const offsetA = parseFloat(a.value.replace("GMT", "").replace(":", "."));
    const offsetB = parseFloat(b.value.replace("GMT", "").replace(":", "."));
    return offsetA - offsetB;
  });
};

/**
 * Get the current timezone in GMT format
 * @returns Current timezone in GMT format
 */
export const getCurrentTimezone = () => {
  // Get the local timezone offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset();
  // Convert to hours (timezone offsets are inverted, so we negate)
  const offsetHours = -offsetMinutes / 60;
  
  // Format as GMT+/-XX
  const sign = offsetHours >= 0 ? '+' : '-';
  const absHours = Math.abs(offsetHours);
  const hours = Math.floor(absHours);
  const minutes = Math.round((absHours - hours) * 60);
  
  if (minutes === 0) {
    return `GMT${sign}${hours}`;
  } else {
    return `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }
};
