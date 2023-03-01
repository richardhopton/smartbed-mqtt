import { Entity } from '@ha/base/Entity';
import { IDeviceData } from '@ha/IDeviceData';
import { DeviceInfoSensor } from '@sleeptracker/entities/DeviceInfoSensor';
import { HelloDataSensor } from '@sleeptracker/entities/InfoSensor';
import { Dictionary } from '@utils/Dictionary';
import { Credentials } from '@utils/Options';
import { Controller } from './Controller';
import { SleepSensor } from './SleepSensor';

type Entities = {
  deviceInfo: DeviceInfoSensor;
  helloData: HelloDataSensor;
};

export type Bed = {
  deviceId: number;
  processorId: number;
  deviceData: IDeviceData;
  primaryUser: Credentials;
  controllers: Controller[];
  sensors: (SleepSensor & { user?: Credentials })[];
  supportedFeatures: {
    smartBedControls: boolean;
    antiSnorePreset: boolean;
    environmentSensors: boolean;
  };
  data: {
    headAngleTicksPerDegree: number;
    footAngleTicksPerDegree: number;
  };
  entities: Entities & Dictionary<Entity>;
};
