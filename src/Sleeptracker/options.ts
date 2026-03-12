import { getRootOptions } from '@utils/options';

export type Type = 'tempur' | 'beautyrest' | 'serta';

export interface Credentials {
  email: string;
  password: string;
  type?: Type;
}

interface OptionsJson {
  sleeptrackerRefreshFrequency: number;
  sleeptrackerClientVersion?: string;
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
export const getClientVersion = () => options.sleeptrackerClientVersion || '1.11.5';
