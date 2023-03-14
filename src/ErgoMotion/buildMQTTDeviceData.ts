import { IDeviceData } from '@ha/IDeviceData';
import { Device } from './types/Device';

export const buildMQTTDeviceData = ({ name, id }: Device): IDeviceData => {
  return {
    deviceTopic: `ergomotion/${id}`,
    device: {
      ids: [`${id}`],
      name: name,
      mf: 'ErgoMotion',
      mdl: '',
    },
  };
};
