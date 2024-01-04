import { getRootOptions } from '@utils/options';

export interface LeggettPlattDevice {
  friendlyName: string;
  name: string;
}

interface OptionsJson {
  leggettPlattDevices: LeggettPlattDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.leggettPlattDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
