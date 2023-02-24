export interface IDeviceData {
  deviceTopic: string;
  device: IDevice;
}

interface IDevice {
  ids: string[];
  name: string;
  mf: string;
  mdl: string;
}
