import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo, logWarn } from '@utils/logger';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { Features } from './Features';
import { controllerBuilder as nordicControllerBuilder } from './Nordic/controllerBuilder';
import { isSupported as isNordicSupported } from './Nordic/isSupported';
import { controllerBuilder as wiLinkeControllerBuilder } from './WiLinke/controllerBuilder';
import { isSupported as isWiLinkeSupported } from './WiLinke/isSupported';
import { getDevices } from './options';
import { remoteFeatures } from './remoteFeatures';
import { setupMassageButtons } from './setupMassageButtons';
import { setupPresetButtons } from './setupPresetButtons';
import { setupUnderBedLightButton } from './setupUnderBedLightButton';
import { setupMotorEntities } from './setupMotorEntities';

const checks = [isNordicSupported, isWiLinkeSupported];
const controllerBuilders = [nordicControllerBuilder, wiLinkeControllerBuilder];

export const richmat = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Richmat] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name.toLowerCase(), value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[Richmat] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect } = bleDevice;
    const { remoteCode, ...device } = devicesMap[mac] || devicesMap[name.toLowerCase()];

    const features = remoteFeatures[remoteCode];
    if (!features) {
      logWarn('[Richmat] Remote code not supported, please contact me on Discord', remoteCode);
      continue;
    }

    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Richmat');
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
        '[Richmat] Device not supported, please contact me on Discord',
        name,
        JSON.stringify({ name, address, manufacturerDataList, serviceUuidsList })
      );
      await disconnect();
      continue;
    }

    if (!device.stayConnected) await disconnect();

    const hasFeature = (feature: Features) => (features & feature) === feature;
    logInfo('[Richmat] Setting up entities for device:', name);
    setupPresetButtons(mqtt, controller, hasFeature);
    setupMassageButtons(mqtt, controller, hasFeature);
    setupUnderBedLightButton(mqtt, controller, hasFeature);
    setupMotorEntities(mqtt, controller, hasFeature);

    const deviceInfo = await bleDevice.getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
  }
};
