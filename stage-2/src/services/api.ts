import axios from 'axios';
import { loggingMiddleware } from '../middleware/loggingMiddleware';

// Default target API configuration
const API_URL = import.meta.env.VITE_NOTIFICATION_API_URL || 'http://4.224.186.213/evaluation-service/notifications';
const API_TOKEN = import.meta.env.VITE_NOTIFICATION_API_TOKEN || '';

export const api = axios.create({
  timeout: 10000,
});

// Request Interceptor (API Request Logging Middleware)
api.interceptors.request.use(
  (config) => {
    const method = config.method || 'get';
    // Use configured API_URL if URL is empty or relative
    const url = config.url || API_URL;
    
    // Attach authorization header if token exists
    if (API_TOKEN) {
      config.headers['Authorization'] = API_TOKEN.startsWith('Bearer ') 
        ? API_TOKEN 
        : `Bearer ${API_TOKEN}`;
    }
    
    loggingMiddleware.logRequest(method, url, { headers: config.headers, params: config.params });
    return config;
  },
  (error) => {
    loggingMiddleware.logError('API Request Configuration Error', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (API Response & Error Logging Middleware)
api.interceptors.response.use(
  (response) => {
    const method = response.config.method || 'get';
    const url = response.config.url || API_URL;
    const status = response.status;
    
    loggingMiddleware.logResponse(method, url, status, response.data);
    return response;
  },
  (error) => {
    const config = error.config || {};
    const method = config.method || 'get';
    const url = config.url || API_URL;
    const status = error.response ? error.response.status : 500;
    const errMsg = error.response?.data?.message || error.message || 'Unknown API Error';
    
    loggingMiddleware.logError(`API Response Error [Status: ${status}] - ${method.toUpperCase()} ${url}`, errMsg);
    return Promise.reject(error);
  }
);

export interface RawNotification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
  Read?: boolean;
  Status?: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  timestampValue: number;
  priorityWeight: number;
  priorityScore: number;
  isRead: boolean;
}

/**
 * Parses notification types into priority weights
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
      return 0;
  }
}

/**
 * Parses timestamp strings like "YYYY-MM-DD HH:mm:ss" safely into epoch milliseconds.
 */
export function parseTimestampToMs(timestampStr: string): number {
  const cleanStr = timestampStr.trim();
  const regex = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
  const match = cleanStr.match(regex);
  
  if (!match) {
    const parsed = Date.parse(cleanStr);
    return isNaN(parsed) ? Date.now() : parsed;
  }

  const [_, year, month, day, hours, minutes, seconds] = match.map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return isNaN(date.getTime()) ? Date.now() : date.getTime();
}

/**
 * Calculates priority score using the formula:
 * (priorityWeight * 1000000) + timestampMs
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

/**
 * Fetch list of raw notifications and map them to our Notification structure
 */
export async function getNotifications(params?: {
  limit?: number;
  page?: number;
  notification_type?: string;
}): Promise<RawNotification[]> {
  const response = await api.get<{ notifications: RawNotification[] }>(API_URL, { params });
  return response.data?.notifications || [];
}
