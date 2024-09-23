import { getRootOptions } from '@utils/options';

export interface LinakDevice {
  friendlyName: string;
  name: string;
  motorCount?: number;
  hasMassage?: boolean;
}

interface OptionsJson {
  linakDevices: LinakDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.linakDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
