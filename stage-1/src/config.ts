import dotenv from 'dotenv';

// Load environment variables if present
dotenv.config();

export const CONFIG = {
  API_URL: process.env.NOTIFICATION_API_URL || 'http://4.224.186.213/evaluation-service/notifications',
  API_TOKEN: process.env.NOTIFICATION_API_TOKEN || '',
  HEAP_LIMIT: parseInt(process.env.HEAP_LIMIT || '10', 10),
};
