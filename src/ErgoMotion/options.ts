import { readFileSync } from 'fs';

export interface Credentials {
  email: string;
  password: string;
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
