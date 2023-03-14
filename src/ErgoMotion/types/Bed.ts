import { Entity } from '@ha/base/Entity';
import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { DeviceInfoSensor } from '../entities/DeviceInfoSensor';
import { Credentials } from '../options';

type Entities = {
  deviceInfo: DeviceInfoSensor;
};

export type Bed = {
  id: number;
  user: Credentials;
  deviceData: IDeviceData;
  entities: Entities & Dictionary<Entity>;
};
