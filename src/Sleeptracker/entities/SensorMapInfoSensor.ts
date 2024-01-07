import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { EntityConfig } from '@ha/base/Entity';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { cleanJsonState } from '@utils/cleanJsonState';
import { SleepSensor } from '../types/SleepSensor';

export class SleepSensorInfoSensor extends JsonSensor<SleepSensor> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, config: EntityConfig) {
    super(mqtt, deviceData, { ...config, category: 'diagnostic', valueField: 'userFirstName' });
  }

  mapState(state: SleepSensor | undefined) {
    return cleanJsonState(state);
  }
}
