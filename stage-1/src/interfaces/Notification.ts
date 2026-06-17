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
}
