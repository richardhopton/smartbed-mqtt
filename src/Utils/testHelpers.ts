import { IDeviceData } from '@ha/IDeviceData';

export const testDevice: IDeviceData = {
  deviceTopic: 'device_topic',
  device: {
    ids: ['id'],
    name: 'Test Name',
    mf: 'Test mf',
    mdl: 'Test mdl',
  },
};

export const mocked = (mock: any) => mock as jest.Mock<any, any>;
