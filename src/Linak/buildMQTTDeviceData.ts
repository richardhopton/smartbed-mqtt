import { IDeviceData } from '@ha/IDeviceData';
import { LinakDevice } from './options';

type Device = LinakDevice & { address: number };

export const buildMQTTDeviceData = ({ friendlyName, name, address }: Device): IDeviceData => {
  return {
    deviceTopic: `linak/${address}`,
    device: {
      ids: [`${address}`],
      name: friendlyName,
      mf: 'Linak',
      mdl: name,
    },
  };
};
