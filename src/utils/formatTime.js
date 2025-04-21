export function formatTime(ms, locale = 'en-US') {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padded = (n) => String(n).padStart(2, "0");

  // For English locale, use HH:MM:SS format
  if (locale === 'en-US') {
    return `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`;
  }
  
  // For other locales, use the Intl.DateTimeFormat
  const date = new Date(0);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

export function formatTimeWithUnits(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
} 