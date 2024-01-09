import { IDeviceData } from '@ha/IDeviceData';

type Device = { friendlyName: string; name: string; address: number | string };

export const buildMQTTDeviceData = ({ friendlyName, name, address }: Device, manufacturer: string): IDeviceData => {
  return {
    deviceTopic: `${manufacturer.toLowerCase()}/${address}`,
    device: {
      ids: [`${address}`],
      name: friendlyName,
      mf: manufacturer,
      mdl: name,
    },
  };
};
