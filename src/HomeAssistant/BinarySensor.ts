import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StatefulEntity } from './base/StatefulEntity';
import { IDeviceData } from './IDeviceData';

export class BinarySensor extends StatefulEntity<boolean> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, entityDesc: string) {
    super(mqtt, deviceData, entityDesc, 'binary_sensor');
  }

  mapState(state?: boolean): string {
    return state ? 'ON' : 'OFF';
  }
}
