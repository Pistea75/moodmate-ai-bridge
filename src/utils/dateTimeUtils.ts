
/**
 * Format session time to 12-hour format
 */
export const formatSessionTime = (dateTimeString: string) => {
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format session date to day, month format
 */
export const formatSessionDate = (dateTimeString: string) => {
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format recording time from seconds to MM:SS
 */
export const formatRecordingTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
