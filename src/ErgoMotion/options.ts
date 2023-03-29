import { readFileSync } from 'fs';

export type RemoteStyle = 'L' | 'M' | 'H';

export interface Credentials {
  email: string;
  password: string;
  remoteStyle: RemoteStyle;
}

interface OptionsJson {
  ergoMotionCredentials: Credentials[];
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getUsers = () => {
  const credentials = options.ergoMotionCredentials;
  if (Array.isArray(credentials)) {
    return credentials;
  }
  return [];
};
