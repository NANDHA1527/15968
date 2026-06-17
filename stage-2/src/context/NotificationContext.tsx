import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getNotifications, calculatePriorityScore } from '../services/api';
import type { RawNotification, Notification } from '../services/api';
import { loggingMiddleware } from '../middleware/loggingMiddleware';

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

export interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  viewedIds: Set<string>;
  markAsViewed: (id: string) => void;
  refresh: (params?: {
    limit?: number;
    page?: number;
    notification_type?: string;
  }) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawList, setRawList] = useState<RawNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  // Load viewed state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viewed_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setViewedIds(new Set(parsed));
          loggingMiddleware.logInfo(`Loaded ${parsed.length} viewed notifications from localStorage.`);
        }
      }
    } catch (e) {
      loggingMiddleware.logError('Failed to load viewed state from localStorage', e);
    }
  }, []);

  // Fetch notifications
  const fetchAll = useCallback(async (params?: {
    limit?: number;
    page?: number;
    notification_type?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(params);
      setRawList(data);
    } catch (err: any) {
      loggingMiddleware.logError('API fetch failed. Falling back to mock notification data.', err.message || err);
      // Fallback to local mock list instead of displaying a full error page
      setRawList(MOCK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Map raw list to structured notifications
  const notifications = useMemo<Notification[]>(() => {
    return rawList.map((raw) => {
      const { score, weight, timestampValue } = calculatePriorityScore(raw.Type, raw.Timestamp);
      const isRead = viewedIds.has(raw.ID) || raw.Read === true || raw.Status?.toLowerCase() === 'read';
      return {
        id: raw.ID,
        type: raw.Type,
        message: raw.Message,
        timestamp: raw.Timestamp,
        timestampValue,
        priorityWeight: weight,
        priorityScore: score,
        isRead,
      };
    });
  }, [rawList, viewedIds]);

  // Mark notification as viewed/read
  const markAsViewed = useCallback((id: string) => {
    loggingMiddleware.logClick(`notification-item-${id}`, { action: 'markAsViewed' });
    setViewedIds((prev) => {
      const next = new Set(prev);
      if (!next.has(id)) {
        next.add(id);
        // Persist to localStorage
        localStorage.setItem('viewed_notifications', JSON.stringify(Array.from(next)));
        loggingMiddleware.logInfo(`Notification ID ${id} marked as viewed and saved to localStorage.`);
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    notifications,
    loading,
    error,
    viewedIds,
    markAsViewed,
    refresh: fetchAll
  }), [notifications, loading, error, viewedIds, markAsViewed, fetchAll]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
