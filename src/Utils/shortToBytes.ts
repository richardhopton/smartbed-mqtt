import { byte } from './byte';

export const shortToBytes = (value: number) => [value >> 8, value].map(byte);
