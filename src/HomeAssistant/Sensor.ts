import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

export class Sensor<T> extends StatefulEntity<T> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, entityConfig: EntityConfig) {
    super(mqtt, deviceData, entityConfig, 'sensor');
  }
}
