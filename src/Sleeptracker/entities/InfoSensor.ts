import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { HelloData } from '@sleeptracker/types/HelloData';
import { cleanJsonState } from '@utils/cleanJsonState';

const fieldsToStrip = ['gmtOffset', 'server_config_url', 'buildMeta'];

export class HelloDataSensor extends JsonSensor<HelloData> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, 'Info', 'Serial', true);
  }

  mapState(state: HelloData | undefined) {
    return cleanJsonState(state, fieldsToStrip);
  }
}
