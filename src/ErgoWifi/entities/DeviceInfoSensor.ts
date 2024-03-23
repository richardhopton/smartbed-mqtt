import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { cleanJsonState } from '@utils/cleanJsonState';
import { Device } from '../requests/types/Device';

export class DeviceInfoSensor extends JsonSensor<Device> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, { description: 'Device Info', category: 'diagnostic', valueField: 'name' });
  }

  mapState(state: Device | undefined) {
    return cleanJsonState(state, ['authorize_code', 'access_key']);
  }
}
