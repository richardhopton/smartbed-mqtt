import { minutes } from '@utils/minutes';
import { getRootOptions } from '@utils/options';
import { seconds } from '@utils/seconds';

export type Type = 'tempur' | 'beautyrest' | 'serta';

export interface Credentials {
  email: string;
  password: string;
  type?: Type;
}

interface OptionsJson {
  sleeptrackerRefreshFrequency: number;
  sleeptrackerRefreshFrequencySeconds?: number;
  sleeptrackerCredentials: Credentials[];
}

const options: OptionsJson = getRootOptions();

export const getUsers = () => {
  const credentials = options.sleeptrackerCredentials;
  if (Array.isArray(credentials)) {
    return credentials;
  }
  return [credentials];
};
export const getRefreshFrequency = () => options.sleeptrackerRefreshFrequency;
export const getRefreshIntervalMs = () => {
  if (options.sleeptrackerRefreshFrequencySeconds && options.sleeptrackerRefreshFrequencySeconds > 0) {
    return seconds(options.sleeptrackerRefreshFrequencySeconds);
  }
  return minutes(options.sleeptrackerRefreshFrequency || 1);
};
