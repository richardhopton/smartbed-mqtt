import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StatefulEntity } from './base/StatefulEntity';
import { IDeviceData } from './IDeviceData';

export class Sensor<T> extends StatefulEntity<T> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, entityDesc: string) {
    super(mqtt, deviceData, entityDesc, 'sensor');
  }
}
