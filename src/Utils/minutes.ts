import { seconds } from './seconds';

export const minutes = (numMinutes: number) => numMinutes * seconds(60);
