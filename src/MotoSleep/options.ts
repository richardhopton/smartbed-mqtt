import { getRootOptions } from '@utils/options';

export interface MotoSleepDevice {
  friendlyName: string;
  name: string;
  stayConnected: boolean | undefined;
}

interface OptionsJson {
  motoSleepDevices: MotoSleepDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.motoSleepDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
