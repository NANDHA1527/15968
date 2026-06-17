// Reusable frontend logging utility

export const Logger = {
  info: (message: string, data?: any) => {
    console.log(
      `%c[INFO] ${new Date().toISOString()} - ${message}`,
      'color: #0ea5e9; font-weight: bold; background: #121212; padding: 2px 5px; border-radius: 3px;',
      data !== undefined ? data : ''
    );
  },
  warn: (message: string, data?: any) => {
    console.warn(
      `%c[WARN] ${new Date().toISOString()} - ${message}`,
      'color: #ffb300; font-weight: bold; background: #121212; padding: 2px 5px; border-radius: 3px;',
      data !== undefined ? data : ''
    );
  },
  error: (message: string, error?: any) => {
    console.error(
      `%c[ERROR] ${new Date().toISOString()} - ${message}`,
      'color: #ff1744; font-weight: bold; background: #121212; padding: 2px 5px; border-radius: 3px;',
      error !== undefined ? error : ''
    );
  },
  apiReq: (method: string, url: string, config?: any) => {
    console.log(
      `%c[API REQ] %c${method.toUpperCase()} ${url}`,
      'color: #9c27b0; font-weight: bold; background: #121212; padding: 2px 5px; border-radius: 3px;',
      'color: #ffffff; font-weight: normal;',
      config || ''
    );
  },
  apiRes: (method: string, url: string, status: number, data?: any) => {
    console.log(
      `%c[API RES] %c${status} - ${method.toUpperCase()} ${url}`,
      'color: #4caf50; font-weight: bold; background: #121212; padding: 2px 5px; border-radius: 3px;',
      'color: #ffffff; font-weight: normal;',
      data || ''
    );
  },
  routeChange: (from: string, to: string) => {
    console.log(
      `%c[ROUTE] %c"${from}" ➔ "${to}"`,
      'color: #2196f3; font-weight: bold; background: #121212; padding: 2px 5px; border-radius: 3px;',
      'color: #ffffff; font-weight: normal;'
    );
  },
  clickEvent: (elementId: string, details?: any) => {
    console.log(
      `%c[CLICK] %cElement: #${elementId}`,
      'color: #e91e63; font-weight: bold; background: #121212; padding: 2px 5px; border-radius: 3px;',
      'color: #ffffff; font-weight: normal;',
      details || ''
    );
  }
};
