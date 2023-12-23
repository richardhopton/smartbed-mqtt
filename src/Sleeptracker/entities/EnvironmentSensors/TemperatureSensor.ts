import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { JsonEnvironmentSensor } from './JsonEnvironmentSensor';

export class TemperatureSensor extends JsonEnvironmentSensor {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, { description: 'Temperature Sensor' });
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_class: 'measurement',
      unit_of_measurement: '°C',
      device_class: 'temperature',
    };
  }
}
