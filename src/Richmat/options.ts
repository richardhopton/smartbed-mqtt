import { readFileSync } from 'fs';

export interface RichmatDevice {
  friendlyName: string;
  name: string;
  remoteCode: string;
}

interface OptionsJson {
  richmatDevices: RichmatDevice[];
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getDevices = () => {
  const devices = options.richmatDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
