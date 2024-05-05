import { getRootOptions } from '@utils/options';

export interface MembersMarkDevice {
  friendlyName: string;
  name: string;
}

interface OptionsJson {
  membersMarkDevices: MembersMarkDevice[];
}

const options: OptionsJson = getRootOptions();

export const getDevices = () => {
  const devices = options.membersMarkDevices;
  if (Array.isArray(devices)) {
    return devices;
  }
  return [];
};
