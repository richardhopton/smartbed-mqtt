import { notEmpty } from './notEmpty';

export const joinNonEmpty = (separator: string, ...items: any[]): string =>
  items
    .filter(notEmpty)
    .filter((item) => item !== '')
    .join(separator);
