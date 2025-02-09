import { byte } from '@utils/byte';
import { sum } from '@utils/sum';

export const calculateChecksum = (bytes: number[]): number => byte((bytes.reduce(sum) ^ 0xff) + 1);
