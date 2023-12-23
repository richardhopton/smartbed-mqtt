import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

export class BinarySensor extends StatefulEntity<boolean> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, config: EntityConfig) {
    super(mqtt, deviceData, config, 'binary_sensor');
  }

  mapState(state?: boolean): string {
    return state ? 'ON' : 'OFF';
  }
}
