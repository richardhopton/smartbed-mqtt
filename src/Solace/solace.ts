import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { getDevices } from './options';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMotorEntities } from './setupMotorEntities';

const nameMapper = (name: string) =>
  name.replace(':', 'A').replace(';', 'B').replace('<', 'C').replace('=', 'D').replace('>', 'E').replace('?', 'F');

export const solace = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Solace] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({
    key: nameMapper(device.name).toLowerCase(),
    value: device,
  }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[Solace] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames, nameMapper);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getCharacteristic } = bleDevice;
    const device = devicesMap[mac] || devicesMap[name.toLowerCase()];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Solace');
    await connect();

    const characteristic = await getCharacteristic(
      '0000ffe0-0000-1000-8000-00805f9b34fb',
      '0000ffe1-0000-1000-8000-00805f9b34fb'
    );
    if (!characteristic) {
      await disconnect();
      continue;
    }

    const controller = new BLEController(
      deviceData,
      bleDevice,
      characteristic.handle,
      (bytes: number[]) => bytes,
      {},
      true
    );
    logInfo('[Solace] Setting up entities for device:', name);
    setupPresetButtons(mqtt, controller);
    setupMotorEntities(mqtt, controller);

    const deviceInfo = await bleDevice.getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
  }
};
