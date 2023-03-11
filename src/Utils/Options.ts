import { readFileSync } from 'fs';

export type SleeptrackerType = 'tempur' | 'beautyrest' | 'serta';

export interface Credentials {
  email: string;
  password: string;
  type?: SleeptrackerType;
}

interface OptionsJson {
  type: 'sleeptracker';
  sleeptrackerRefreshFrequency: number;
  sleeptrackerCredentials: Credentials[];
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getType = () => options.type;
export const getSleeptrackerUsers = () => {
  const credentials = options.sleeptrackerCredentials;
  if (Array.isArray(credentials)) {
    return credentials;
  }
  return [credentials];
};
export const getSleeptrackerRefreshFrequency = () => options.sleeptrackerRefreshFrequency;
