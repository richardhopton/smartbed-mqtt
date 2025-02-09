import { byte } from './byte';

export const intToBytes = (value: number) => [value >> 24, value >> 16, value >> 8, value].map(byte);
