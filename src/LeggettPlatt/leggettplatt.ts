import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { controllerBuilder as gen2ControllerBuilder } from './Gen2/controllerBuilder';
import { isSupported as isGen2Supported } from './Gen2/isSupported';
import { controllerBuilder as okinControllerBuilder } from './Okin/controllerBuilder';
import { isSupported as isOkinSupported } from './Okin/isSupported';
import { getDevices } from './options';

const checks = [isGen2Supported, isOkinSupported];
const controllerBuilders = [gen2ControllerBuilder, okinControllerBuilder];

export const leggettplatt = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[LeggettPlatt] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap));
  for (const bleDevice of bleDevices) {
    const { name, address, connect, disconnect, getServices } = bleDevice;

    const controllerBuilder = checks
      .map((check, index) => (check(bleDevice) ? controllerBuilders[index] : undefined))
      .filter((check) => check)[0];
    if (controllerBuilder === undefined) continue;

    const device = devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'LeggettPlatt');
    await connect();

    const services = await getServices();

    const controller = controllerBuilder(mqtt, deviceData, bleDevice, device, services);
    if (!controller) {
      await disconnect();
      continue;
    }
  }
};
