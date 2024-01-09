import { getRootOptions } from '@utils/options';

export interface LogicdataDevice {
  friendlyName: string;
  name: string;
  ipAddress: string | undefined;
}

interface OptionsJson {
  logicdataDevices: LogicdataDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.logicdataDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
