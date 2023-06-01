import { getRootOptions } from '@utils/options';

export type Type = 'standard' | 'advanced';

export interface LinakDevice {
  friendlyName: string;
  name: string;
  type: Type;
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
