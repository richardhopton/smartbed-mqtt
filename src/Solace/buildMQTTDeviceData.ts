import { IDeviceData } from '@ha/IDeviceData';
import { SolaceDevice } from './options';

type Device = SolaceDevice & { address: number };

export const buildMQTTDeviceData = ({ friendlyName, name, address }: Device): IDeviceData => {
  return {
    deviceTopic: `solace/${address}`,
    device: {
      ids: [`${address}`],
      name: friendlyName,
      mf: 'Solace',
      mdl: name,
    },
  };
};
