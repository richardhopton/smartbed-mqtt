import { getRootOptions } from '@utils/options';

export interface FurniMoveDevice {
  friendlyName: string;
  name: string;
  remoteCode: string;
}

interface OptionsJson {
  furniMoveDevices: FurniMoveDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.furniMoveDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
