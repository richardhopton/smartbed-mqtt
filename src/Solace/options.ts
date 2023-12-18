import { getRootOptions } from '@utils/options';

export interface SolaceDevice {
  friendlyName: string;
  name: string;
}

interface OptionsJson {
  solaceDevices: SolaceDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.solaceDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
