import { Entity } from '@ha/base/Entity';
import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { DeviceInfoSensor } from '../entities/DeviceInfoSensor';
import { HelloDataSensor } from '../entities/InfoSensor';
import { Credentials } from '../options';
import { Controller } from './Controller';
import { SleepSensor } from './SleepSensor';

type Entities = {
  deviceInfo: DeviceInfoSensor;
  helloData: HelloDataSensor;
};

export type Bed = {
  processorId: number;
  deviceData: IDeviceData;
  primaryUser: Credentials;
  controllers: Controller[];
  sensors: (SleepSensor & { user?: Credentials })[];
  supportedFeatures: {
    smartBedControls: boolean;
    antiSnorePreset: boolean;
    environmentSensors: boolean;
    motors: boolean;
  };
  data: {
    headAngleTicksPerDegree: number;
    footAngleTicksPerDegree: number;
  };
  entities: Entities & Dictionary<Entity>;
};
