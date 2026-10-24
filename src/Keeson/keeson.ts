import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo, logWarn } from '@utils/logger';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { controllerBuilder as baseI4ControllerBuilder } from './BaseI4/controllerBuilder';
import { isSupported as isBaseI4Supported } from './BaseI4/isSupported';
import { controllerBuilder as baseI5ControllerBuilder } from './BaseI5/controllerBuilder';
import { isSupported as isBaseI5Supported } from './BaseI5/isSupported';
import { controllerBuilder as ksbtControllerBuilder } from './KSBT/controllerBuilder';
import { isSupported as isKsbtSupported } from './KSBT/isSupported';
import { getDevices } from './options';
import { setupMassageButtons } from './setupMassageButtons';
import { setupMotorEntities } from './setupMotorEntities';
import { setupPresetButtons } from './setupPresetButtons';

const checks = [isKsbtSupported, isBaseI5Supported, isBaseI4Supported];
const controllerBuilders = [ksbtControllerBuilder, baseI5ControllerBuilder, baseI4ControllerBuilder];

export const keeson = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Keeson] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name.toLowerCase(), value: device }));
  const deviceNames = Object.keys(devicesMap);

  if (deviceNames.length !== devices.length) return logError('[Keeson] Duplicate name detected in configuration');

  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getDeviceInfo } = bleDevice;
    const device = devicesMap[mac] || devicesMap[name.toLowerCase()];

    if (!device) {
      logInfo(`[Keeson] Device not found in configuration for MAC: ${mac} or Name: ${name}`);
      continue;
    }

    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Keeson');
    await connect();

    const matchedBuilder = checks
      .map((check, index) => (check(bleDevice) ? controllerBuilders[index] : undefined))
      .filter((check) => check)[0];

    let controller = matchedBuilder ? await matchedBuilder(deviceData, bleDevice) : undefined;
    if (!controller && !matchedBuilder) {
      for (const builder of controllerBuilders) {
        controller = await builder(deviceData, bleDevice);
        if (controller) break;
      }
    }

    if (!controller) {
      const {
        advertisement: { manufacturerDataList, serviceUuidsList },
      } = bleDevice;
      logWarn(
        '[Keeson] Device not supported, please contact me on Discord',
        name,
        JSON.stringify({ name, address, manufacturerDataList, serviceUuidsList })
      );
      await disconnect();
      continue;
    }

    logInfo('[Keeson] Setting up entities for device:', name);
    setupPresetButtons(mqtt, controller);
    setupMassageButtons(mqtt, controller);
    setupMotorEntities(mqtt, controller);

    const deviceInfo = await getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
  }
};
