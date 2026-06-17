import axios from 'axios';
import { CONFIG } from '../config';
import { RawNotification, Notification } from '../interfaces/Notification';
import { calculatePriorityScore } from '../utils/priorityCalculator';
import { Logger } from '../utils/logger';

const MOCK_NOTIFICATIONS: RawNotification[] = [
  {
    ID: "d146095a-0d86-4a34-9e69-3900a14576bc",
    Type: "Result",
    Message: "mid-sem",
    Timestamp: "2026-04-22 17:51:30"
  },
  {
    ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
    Type: "Placement",
    Message: "CSX Corporation hiring",
    Timestamp: "2026-04-22 17:51:18"
  },
  {
    ID: "81589ada-0ad3-4f77-9554-f52fb558e09d",
    Type: "Event",
    Message: "farewell",
    Timestamp: "2026-04-22 17:51:06"
  },
  {
    ID: "0005513a-142b-4bbc-8678-eefec65e1ede",
    Type: "Result",
    Message: "mid-sem",
    Timestamp: "2026-04-22 17:50:54"
  },
  {
    ID: "ea836726-c25e-4f21-a72f-544a6af8a37f",
    Type: "Result",
    Message: "project-review",
    Timestamp: "2026-04-22 17:50:42"
  },
  {
    ID: "003cb427-8fc6-47f7-bb00-be228f6b0d2c",
    Type: "Result",
    Message: "external",
    Timestamp: "2026-04-22 17:50:30"
  },
  {
    ID: "e5c4ff20-31bf-4d40-8f02-72fda59e8918",
    Type: "Result",
    Message: "project-review",
    Timestamp: "2026-04-22 17:50:18"
  },
  {
    ID: "1cfce5ee-ad37-4894-8946-d707627176a5",
    Type: "Event",
    Message: "tech-fest",
    Timestamp: "2026-04-22 17:50:06"
  },
  {
    ID: "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8",
    Type: "Result",
    Message: "project-review",
    Timestamp: "2026-04-22 17:49:54"
  },
  {
    ID: "8a7412bd-6065-4d09-8501-a37f11cc848b",
    Type: "Placement",
    Message: "Advanced Micro Devices Inc. hiring",
    Timestamp: "2026-04-22 17:49:42"
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
