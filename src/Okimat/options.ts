import { getRootOptions } from '@utils/options';

export interface OkimatDevice {
  friendlyName: string;
  name: string;
  remoteCode: string;
}

interface OptionsJson {
  okimatDevices: OkimatDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.okimatDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
