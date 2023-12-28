import { getRootOptions } from '@utils/options';

export interface ReverieDevice {
  friendlyName: string;
  name: string;
}

interface OptionsJson {
  reverieDevices: ReverieDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.reverieDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
