import { logWarn } from './logger';

export const safeId = (value: string | null | undefined): string => {
  if (value === null || value === undefined) {
    logWarn('[Utils] safeId received null or undefined value, falling back to "unknown"');
    return 'unknown';
  }
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/__+/, '_');
};
