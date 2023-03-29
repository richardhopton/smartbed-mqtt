import { IDeviceData } from '@ha/IDeviceData';
import { RichmatDevice } from './options';

type Device = RichmatDevice & { address: number };

export const buildMQTTDeviceData = ({ friendlyName, name, address }: Device): IDeviceData => {
  return {
    deviceTopic: `richmat/${address}`,
    device: {
      ids: [`${address}`],
      name: friendlyName,
      mf: 'Richmat',
      mdl: name,
    },
  };
};
