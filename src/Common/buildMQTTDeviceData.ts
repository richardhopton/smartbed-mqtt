import { IDeviceData } from '@ha/IDeviceData';
import { safeId } from '@utils/safeId';

type Device = { friendlyName: string; name: string; address: number | string };

export const buildMQTTDeviceData = ({ friendlyName, name, address }: Device, manufacturer: string): IDeviceData => {
  return {
    deviceTopic: `${safeId(manufacturer)}/${safeId(address.toString())}`,
    device: {
      ids: [`${address}`],
      name: friendlyName,
      mf: manufacturer,
      mdl: name,
    },
  };
};
