import { getRootOptions } from '@utils/options';

export type RemoteStyle = 'L' | 'M' | 'H';

export interface ErgoMotionUser {
  email: string;
  password: string;
  remoteStyle: RemoteStyle;
}

interface OptionsJson {
  ergoMotionCredentials: ErgoMotionUser[];
}

const options: OptionsJson = getRootOptions();

export const getUsers = () => {
  const credentials = options.ergoMotionCredentials;
  if (Array.isArray(credentials)) {
    return credentials;
  }
  return [];
};
