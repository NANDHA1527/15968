import { Logger } from '../utils/logger';

/**
 * Reusable Logging Middleware helper for the application.
 * Centrally manages logging API requests, responses, route changes, errors, and click events.
 */
export const loggingMiddleware = {
  logRequest: (method: string, url: string, data?: any) => {
    Logger.apiReq(method, url, data);
  },
  
  logResponse: (method: string, url: string, status: number, data?: any) => {
    Logger.apiRes(method, url, status, data);
  },

  logRouteChange: (from: string, to: string) => {
    Logger.routeChange(from, to);
  },

  logClick: (elementId: string, details?: any) => {
    Logger.clickEvent(elementId, details);
  },

  logInfo: (message: string, data?: any) => {
    Logger.info(message, data);
  },

  logError: (message: string, error?: any) => {
    Logger.error(message, error);
  }
};
