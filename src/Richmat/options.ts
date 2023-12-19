import { getRootOptions } from '@utils/options';

export interface RichmatDevice {
  friendlyName: string;
  name: string;
  remoteCode: string;
  stayConnected: boolean | undefined;
}

interface OptionsJson {
  richmatDevices: RichmatDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.richmatDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
