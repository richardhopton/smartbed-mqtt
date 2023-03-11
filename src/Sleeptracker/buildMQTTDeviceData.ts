import { IDeviceData } from '@ha/IDeviceData';
import { Device } from './types/Device';

export const buildMQTTDeviceData = ({
  name,
  mattressBrandName,
  modelID,
  sleeptrackerProcessorID: processorId,
}: Device): IDeviceData => {
  return {
    deviceTopic: `sleeptracker/${processorId}`,
    device: {
      ids: [`${processorId}`],
      name: name,
      mf: mattressBrandName || 'Sleeptracker',
      mdl: modelID,
    },
  };
};
