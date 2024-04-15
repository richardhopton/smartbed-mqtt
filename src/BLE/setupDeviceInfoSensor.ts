import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceEntityCache } from 'Common/IController';
import { BLEDeviceInfo } from 'ESPHome/types/BLEDeviceInfo';
import { DeviceInfoSensor } from './DeviceInfoSensor';

export const setupDeviceInfoSensor = (
  mqtt: IMQTTConnection,
  { deviceData, entities }: IDeviceEntityCache,
  deviceInfo: BLEDeviceInfo
) => {
  const cache = entities as { deviceInfo?: DeviceInfoSensor };
  if (!cache.deviceInfo) {
    cache.deviceInfo = new DeviceInfoSensor(mqtt, deviceData);
  }
  cache.deviceInfo.setState(deviceInfo);
};
