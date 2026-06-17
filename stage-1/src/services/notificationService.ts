import axios from 'axios';
import { CONFIG } from '../config';
import { RawNotification, Notification } from '../interfaces/Notification';
import { calculatePriorityScore } from '../utils/priorityCalculator';
import { Logger } from '../utils/logger';

const MOCK_NOTIFICATIONS: RawNotification[] = [
  {
    ID: "mock-1",
    Type: "Placement",
    Message: "Google India placement drive registration starts at 12:00 PM tomorrow.",
    Timestamp: "2026-06-17 11:00:00"
  },
  {
    ID: "mock-2",
    Type: "Result",
    Message: "Mid-term examination grades for Computer Science (CS302) have been published.",
    Timestamp: "2026-06-17 10:30:00"
  },
  {
    ID: "mock-3",
    Type: "Event",
    Message: "Annual Tech Fest 'Innvobizz 2026' registration is now open.",
    Timestamp: "2026-06-17 09:15:00"
  },
  {
    ID: "mock-4",
    Type: "Placement",
    Message: "Microsoft SWE Intern shortlist announced. Interview schedule attached.",
    Timestamp: "2026-06-17 08:45:00"
  },
  {
    ID: "mock-5",
    Type: "Result",
    Message: "Practical Lab Examination marks for Software Engineering are declared.",
    Timestamp: "2026-06-17 08:00:00"
  },
  {
    ID: "mock-6",
    Type: "Event",
    Message: "Seminar on Artificial Intelligence and Ethics in Audi-1 today at 2 PM.",
    Timestamp: "2026-06-16 16:30:00"
  },
  {
    ID: "mock-7",
    Type: "Placement",
    Message: "Amazon applied intelligence hiring test link is active for 24 hours.",
    Timestamp: "2026-06-16 14:00:00"
  },
  {
    ID: "mock-8",
    Type: "Result",
    Message: "Re-evaluation results for Odd Semester 2025-2026 declared.",
    Timestamp: "2026-06-16 11:30:00"
  },
  {
    ID: "mock-9",
    Type: "Event",
    Message: "Sports Day registrations deadline extended to next Friday.",
    Timestamp: "2026-06-15 10:00:00"
  },
  {
    ID: "mock-10",
    Type: "Placement",
    Message: "Cognizant GenC onboarding instructions emailed to selected candidates.",
    Timestamp: "2026-06-15 09:00:00"
  }
];

/**
 * Fetches notifications from the configured API endpoint,
 * parses/calculates priority metrics, and returns the mapped notification list.
 */
export async function fetchNotifications(): Promise<Notification[]> {
  try {
    Logger.info(`Fetching notifications from API: ${CONFIG.API_URL}...`);
    
    // Construct request headers if API_TOKEN is available
    const headers: Record<string, string> = {};
    if (CONFIG.API_TOKEN) {
      headers['Authorization'] = CONFIG.API_TOKEN.startsWith('Bearer ')
        ? CONFIG.API_TOKEN
        : `Bearer ${CONFIG.API_TOKEN}`;
      Logger.info('Attaching authorization token to request headers.');
    }

    const response = await axios.get<{ notifications: RawNotification[] }>(CONFIG.API_URL, {
      headers,
      timeout: 10000, // 10-second timeout
    });

    if (!response.data || !Array.isArray(response.data.notifications)) {
      Logger.warn('Invalid API response format. Expected an object with a "notifications" array.');
      return [];
    }

    const rawNotifications = response.data.notifications;
    Logger.info(`Successfully fetched ${rawNotifications.length} raw notifications.`);

    // Filter unread notifications
    const unreadRaw = rawNotifications.filter((raw) => {
      if (raw.Read !== undefined) {
        return !raw.Read;
      }
      if (raw.Status !== undefined) {
        return raw.Status.toLowerCase() === 'unread';
      }
      return true; // default to true if no status field is present
    });
    Logger.info(`Filtered down to ${unreadRaw.length} unread notifications.`);

    const processedNotifications: Notification[] = unreadRaw.map((raw) => {
      const { score, weight, timestampValue } = calculatePriorityScore(raw.Type, raw.Timestamp);
      return {
        id: raw.ID,
        type: raw.Type,
        message: raw.Message,
        timestamp: raw.Timestamp,
        timestampValue,
        priorityWeight: weight,
        priorityScore: score,
      };
    });

    return processedNotifications;
  } catch (error: any) {
    Logger.error('Failed to fetch notifications from API. Falling back to local mock data.', error.message || error);
    
    // Process and return mock notifications as fallback
    const processedNotifications: Notification[] = MOCK_NOTIFICATIONS.map((raw) => {
      const { score, weight, timestampValue } = calculatePriorityScore(raw.Type, raw.Timestamp);
      return {
        id: raw.ID,
        type: raw.Type,
        message: raw.Message,
        timestamp: raw.Timestamp,
        timestampValue,
        priorityWeight: weight,
        priorityScore: score,
      };
    });
    
    return processedNotifications;
  }
}
