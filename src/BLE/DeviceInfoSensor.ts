import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { BLEDeviceInfo } from '../ESPHome/types/BLEDeviceInfo';

export class DeviceInfoSensor extends JsonSensor<BLEDeviceInfo> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, { description: 'Device Info', category: 'diagnostic', valueField: 'modelNumber' });
  }
}
