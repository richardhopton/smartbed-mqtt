import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { JsonEnvironmentSensor } from './JsonEnvironmentSensor';

export class VOCSensor extends JsonEnvironmentSensor {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, 'VOC Sensor');
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_class: 'measurement',
      unit_of_measurement: 'ppb',
      device_class: 'volatile_organic_compounds',
      icon: 'mdi:cloud',
    };
  }
}
