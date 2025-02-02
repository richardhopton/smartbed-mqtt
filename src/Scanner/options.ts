import { getRootOptions } from '@utils/options';

export interface ScannerDevice {
  name: string;
  pair?: boolean;
}

interface OptionsJson {
  scannerDevices: ScannerDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.scannerDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
