import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getNotifications, calculatePriorityScore } from '../services/api';
import type { RawNotification, Notification } from '../services/api';
import { loggingMiddleware } from '../middleware/loggingMiddleware';

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
