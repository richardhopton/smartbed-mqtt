import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { cleanJsonState } from '@utils/cleanJsonState';
import { HelloData } from '../types/HelloData';

const fieldsToStrip = ['gmtOffset', 'server_config_url', 'buildMeta'];

export class HelloDataSensor extends JsonSensor<HelloData> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, { description: 'Info', category: 'diagnostic', valueField: 'Serial' });
  }

  mapState(state: HelloData | undefined) {
    return cleanJsonState(state, fieldsToStrip);
  }
}
