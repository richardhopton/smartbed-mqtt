import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo, logWarn } from '@utils/logger';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
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

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name.toLowerCase(), value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[LeggettPlatt] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect } = bleDevice;

    const controllerBuilder = checks
      .map((check, index) => (check(bleDevice) ? controllerBuilders[index] : undefined))
      .filter((check) => check)[0];
    if (controllerBuilder === undefined) {
      const {
        advertisement: { manufacturerDataList, serviceUuidsList },
      } = bleDevice;
      logWarn(
        '[LeggettPlatt] Device not supported, please contact me on Discord',
        name,
        JSON.stringify({ name, address, manufacturerDataList, serviceUuidsList })
      );
      continue;
    }

    const device = devicesMap[mac] || devicesMap[name.toLowerCase()];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'LeggettPlatt');
    await connect();

    const controller = await controllerBuilder(mqtt, deviceData, bleDevice);
    if (!controller) {
      await disconnect();
      continue;
    }

    const deviceInfo = await bleDevice.getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
  }
};
