import { IDeviceData } from '@ha/IDeviceData';
import { Device } from './types/Device';

export const buildMQTTDeviceData = ({
  name,
  mattressBrandName,
  modelID,
  sleeptrackerID,
  sleeptrackerProcessorID: processorId,
}: Device): IDeviceData => {
  const id = `${sleeptrackerID}_${processorId}`;
  return {
    deviceTopic: `sleeptracker/${id}`,
    device: {
      ids: [id],
      name: name,
      mf: mattressBrandName || 'Sleeptracker',
      mdl: modelID,
    },
  };
};
