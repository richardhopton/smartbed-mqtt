import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { JsonEnvironmentSensor } from './JsonEnvironmentSensor';

export class CO2Sensor extends JsonEnvironmentSensor {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, { description: 'CO2 Sensor' });
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_class: 'measurement',
      unit_of_measurement: 'ppm',
      device_class: 'carbon_dioxide',
      icon: 'mdi:molecule-co2',
    };
  }
}
