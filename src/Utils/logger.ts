type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const format = (level: LogLevel, message: any) => {
  return `${level} [${new Date().toISOString()}] ${message}`;
};

export const logInfo = (message: any, ...optionalParams: any[]) => {
  console.info(format('info', message), ...optionalParams);
};
export const logWarn = (message: any, ...optionalParams: any[]) => {
  console.warn(format('warn', message), ...optionalParams);
};
export const logError = (message: any, ...optionalParams: any[]) => {
  console.error(format('error', message), ...optionalParams);
};
