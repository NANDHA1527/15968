export const Logger = {
  info: (message: string, ...optionalParams: any[]): void => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...optionalParams);
  },
  warn: (message: string, ...optionalParams: any[]): void => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...optionalParams);
  },
  error: (message: string, error?: any): void => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error !== undefined ? error : '');
  }
};
