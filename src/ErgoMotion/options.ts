import { getRootOptions } from '@utils/options';

export type RemoteStyle = 'L' | 'M' | 'H';

export interface ErgoMotionDevice {
  ipAddress: string;
  friendlyName: string;
  remoteStyle: RemoteStyle;
}

interface OptionsJson {
  ergoMotionDevices: ErgoMotionDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.ergoMotionDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
