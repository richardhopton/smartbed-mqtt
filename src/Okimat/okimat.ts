import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { intToBytes } from '@utils/intToBytes';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { getDevices } from './options';
import { setupLightEntities } from './setupLightEntities';
import { setupPresetButtons } from './setupPresetButtons';
import { supportedRemotes } from './supportedRemotes';
import { setupMotorEntities } from './setupMotorEntities';

const buildCommand = (command: number) => [0x4, 0x2, ...intToBytes(command)];

export const okimat = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Okimat] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name.toLowerCase(), value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[Okimat] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, pair, disconnect, getCharacteristic, getDeviceInfo } = bleDevice;
    const { remoteCode, ...device } = devicesMap[mac] || devicesMap[name.toLowerCase()];
    const remote = supportedRemotes[remoteCode];
    if (!remote) {
      logError(`[Okimat] Unsupported remote code '${remoteCode}' for device:`, name);
      continue;
    }
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Okimat');
    await connect();
    await pair();

    const writeCharacteristic = await getCharacteristic(
      '62741523-52f9-8864-b1ab-3b3a8d65950b',
      '62741525-52f9-8864-b1ab-3b3a8d65950b'
    );
    if (!writeCharacteristic) {
      await disconnect();
      continue;
    }

    const feedbackCharacteristic = await getCharacteristic(
      '62741523-52f9-8864-b1ab-3b3a8d65950b',
      '62741625-52f9-8864-b1ab-3b3a8d65950b',
      false
    );
    const notifyHandles = feedbackCharacteristic && { feedback: feedbackCharacteristic.handle };

    const controller = new BLEController(
      deviceData,
      bleDevice,
      writeCharacteristic.handle,
      buildCommand,
      notifyHandles
    );
    logInfo('[Okimat] Setting up entities for device:', name);
    const deviceInfo = await getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
    const { modelNumber } = deviceInfo || {};
    if (modelNumber) logInfo('[Okimat] Model number:', modelNumber);
    setupLightEntities(mqtt, controller, remote);
    setupPresetButtons(mqtt, controller, remote);
    setupMotorEntities(mqtt, controller, remote);
  }
};
