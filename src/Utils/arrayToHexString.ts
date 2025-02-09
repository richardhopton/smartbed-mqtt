import { byte } from './byte';

export const arrayToHexString = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => byte(b).toString(16).padStart(2, '0')).join('');
