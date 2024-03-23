import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Controller } from './Controller';
import { DeviceInfoSensor } from './entities/DeviceInfoSensor';

export const setupDeviceInfoSensor = (mqtt: IMQTTConnection, { deviceData, device, entities }: Controller) => {
  const cache = entities as { deviceInfo?: DeviceInfoSensor };
  if (!cache.deviceInfo) {
    cache.deviceInfo = new DeviceInfoSensor(mqtt, deviceData);
  }
  cache.deviceInfo.setState(device);
};
