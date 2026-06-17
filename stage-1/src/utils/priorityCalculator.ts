import { Logger } from './logger';

/**
 * Maps notification type to priority weight:
 * Placement = 3
 * Result = 2
 * Event = 1
 * Default = 0 (with a warning)
 */
export function getTypeWeight(type: string): number {
  switch (type.trim().toLowerCase()) {
    case 'placement':
      return 3;
    case 'result':
      return 2;
    case 'event':
      return 1;
    default:
      Logger.warn(`Unknown notification type received: "${type}". Defaulting weight to 0.`);
      return 0;
  }
}

/**
 * Parses timestamp string of format "YYYY-MM-DD HH:mm:ss" safely into epoch milliseconds.
 * Falls back to standard JS Date.parse if the regex fails.
 */
export function parseTimestampToMs(timestampStr: string): number {
  const cleanStr = timestampStr.trim();
  // Match "YYYY-MM-DD HH:mm:ss"
  const regex = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
  const match = cleanStr.match(regex);
  
  if (!match) {
    const parsed = Date.parse(cleanStr);
    if (isNaN(parsed)) {
      Logger.warn(`Unable to parse timestamp "${timestampStr}". Using current time.`);
      return Date.now();
    }
    return parsed;
  }

  const [_, year, month, day, hours, minutes, seconds] = match.map(Number);
  // Month is 0-indexed in JavaScript Date
  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  
  if (isNaN(date.getTime())) {
    Logger.warn(`Parsed values from "${timestampStr}" result in an invalid date. Using current time.`);
    return Date.now();
  }
  
  return date.getTime();
}

/**
 * Calculates priority score using the formula:
 * (priorityWeight * 1000000) + timestampValue
 */
export function calculatePriorityScore(type: string, timestamp: string): {
  weight: number;
  timestampValue: number;
  score: number;
} {
  const weight = getTypeWeight(type);
  const timestampValue = parseTimestampToMs(timestamp);
  const score = (weight * 1000000) + timestampValue;
  return { weight, timestampValue, score };
}
