import { getRootOptions } from '@utils/options';

export interface LinakDevice {
  friendlyName: string;
  name: string;
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
