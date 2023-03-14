import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { cleanJsonState } from '@utils/cleanJsonState';
import { SleepSensor } from '../types/SleepSensor';

export class SleepSensorInfoSensor extends JsonSensor<SleepSensor> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, entityDesc: string) {
    super(mqtt, deviceData, entityDesc, 'userFirstName', true);
  }

  mapState(state: SleepSensor | undefined) {
    return cleanJsonState(state);
  }
}
